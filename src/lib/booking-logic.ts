// Pure, framework-free booking logic: pricing, validation, limits and the
// WhatsApp message builder. Kept separate from any Astro/DOM code so it can
// be unit tested directly (see tests/booking-logic.test.ts).

import { business } from "../data/business";

export interface BookingDetails {
  hireDate: string; // ISO yyyy-mm-dd
  returnDate: string; // ISO yyyy-mm-dd
  chairs: number;
  tables: number;
  name: string;
  phone: string;
  postcode: string;
  address: string;
  delivery: "collect" | "deliver";
  notes: string;
}

export interface PricingResult {
  days: number;
  isLongHire: boolean;
  chairsCost: number;
  tablesCost: number;
  total: number;
  isFullSet: boolean;
}

export function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calcHireDays(hireDate: string, returnDate: string): number {
  const start = parseIsoDate(hireDate);
  const end = parseIsoDate(returnDate);
  if (!start || !end) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay);
  return diff + 1;
}

export function isLongHire(days: number): boolean {
  return days > business.hire.maxStandardDays;
}

export function isOverChairLimit(chairs: number): boolean {
  return chairs > business.stock.maxChairs;
}

export function isOverTableLimit(tables: number): boolean {
  return tables > business.stock.maxTables;
}

export function calcPricing(
  hireDate: string,
  returnDate: string,
  chairs: number,
  tables: number,
): PricingResult {
  const days = calcHireDays(hireDate, returnDate);
  const chairsCost = chairs * business.pricing.chairPrice;
  const tablesCost = tables * business.pricing.tablePrice;
  const isFullSet = chairs === business.stock.maxChairs && tables === business.stock.maxTables;
  return {
    days,
    isLongHire: isLongHire(days),
    chairsCost,
    tablesCost,
    total: chairsCost + tablesCost,
    isFullSet,
  };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDateLong(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  const weekday = WEEKDAYS[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return "Enter your name.";
  return null;
}

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

export function validatePostcode(postcode: string): string | null {
  const trimmed = postcode.trim();
  if (!trimmed) return "Enter your postcode.";
  if (!UK_POSTCODE_RE.test(trimmed)) return "Enter a valid UK postcode, e.g. BD1 1AA.";
  return null;
}

export function validateAddress(address: string): string | null {
  if (!address.trim()) return "Enter your address.";
  return null;
}

const UK_PHONE_RE = /^(?:\+44|0044|0)7\d{9}$|^(?:\+44|0044|0)[1-9]\d{8,9}$/;

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Enter your phone number.";
  const cleaned = trimmed.replace(/[\s()-]/g, "");
  if (!UK_PHONE_RE.test(cleaned)) return "Enter a valid UK phone number, e.g. 07123 456789.";
  return null;
}

export function validateDates(hireDate: string, returnDate: string): string | null {
  const start = parseIsoDate(hireDate);
  const end = parseIsoDate(returnDate);
  if (!start) return "Choose a hire date.";
  if (!end) return "Choose a return date.";

  const todayUtc = new Date();
  const todayMidnight = Date.UTC(
    todayUtc.getFullYear(),
    todayUtc.getMonth(),
    todayUtc.getDate(),
  );
  if (start.getTime() < todayMidnight) return "The hire date can't be in the past.";
  if (end.getTime() < start.getTime()) return "The return date can't be before the hire date.";
  return null;
}

export function validateItems(chairs: number, tables: number): string | null {
  if (chairs <= 0 && tables <= 0) return "Add at least 1 chair or 1 table.";
  return null;
}

export function normaliseWhatsAppPhone(uk: string): string {
  const cleaned = uk.trim().replace(/[\s()-]/g, "");
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("0044")) return cleaned.slice(2);
  if (cleaned.startsWith("0")) return `44${cleaned.slice(1)}`;
  return cleaned;
}

export function buildWhatsAppMessage(details: BookingDetails): string {
  const pricing = calcPricing(details.hireDate, details.returnDate, details.chairs, details.tables);

  const totalLine = pricing.isLongHire
    ? "Hire total: Longer than 2 days — please confirm price"
    : `Hire total: ${business.pricing.currencySymbol}${pricing.total}`;

  const deliveryLine =
    details.delivery === "deliver"
      ? "Delivery & collection: Yes — please send me the price"
      : "Delivery & collection: No — I'll collect";

  const lines = [
    `Hi, I'd like to book with ${business.name}.`,
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Address: ${details.address}, ${details.postcode}`,
    "",
    `Hire date: ${formatDateLong(details.hireDate)}`,
    `Return date: ${formatDateLong(details.returnDate)}`,
    "",
    `Chairs: ${details.chairs}`,
    `Tables: ${details.tables}`,
    totalLine,
    "",
    deliveryLine,
  ];

  if (details.notes.trim()) {
    lines.push("", `Notes: ${details.notes.trim()}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(details: BookingDetails): string {
  const message = buildWhatsAppMessage(details);
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
