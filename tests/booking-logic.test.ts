import { describe, expect, it } from "vitest";
import {
  calcHireDays,
  calcPricing,
  isLongHire,
  isOverChairLimit,
  isOverTableLimit,
  validatePostcode,
  validatePhone,
  validateDates,
  validateItems,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatDateLong,
} from "../src/lib/booking-logic";

describe("calcHireDays", () => {
  it("counts a same-day hire as 1 day", () => {
    expect(calcHireDays("2026-12-14", "2026-12-14")).toBe(1);
  });

  it("counts hire date + next day as 2 days", () => {
    expect(calcHireDays("2026-12-14", "2026-12-15")).toBe(2);
  });

  it("counts a 3-day span correctly", () => {
    expect(calcHireDays("2026-12-14", "2026-12-16")).toBe(3);
  });
});

describe("isLongHire", () => {
  it("is not long at 1 or 2 days", () => {
    expect(isLongHire(1)).toBe(false);
    expect(isLongHire(2)).toBe(false);
  });

  it("is long beyond 2 days", () => {
    expect(isLongHire(3)).toBe(true);
  });
});

describe("limits", () => {
  it("flags more than 40 chairs", () => {
    expect(isOverChairLimit(40)).toBe(false);
    expect(isOverChairLimit(41)).toBe(true);
  });

  it("flags more than 4 tables", () => {
    expect(isOverTableLimit(4)).toBe(false);
    expect(isOverTableLimit(5)).toBe(true);
  });
});

describe("calcPricing", () => {
  it("prices chairs and tables at £4 / £10", () => {
    const result = calcPricing("2026-12-14", "2026-12-15", 30, 2);
    expect(result.chairsCost).toBe(120);
    expect(result.tablesCost).toBe(20);
    expect(result.total).toBe(140);
    expect(result.isFullSet).toBe(false);
  });

  it("marks the full set at 40 chairs + 4 tables as £200", () => {
    const result = calcPricing("2026-12-14", "2026-12-15", 40, 4);
    expect(result.total).toBe(200);
    expect(result.isFullSet).toBe(true);
  });

  it("flags hires longer than 2 days", () => {
    const result = calcPricing("2026-12-14", "2026-12-17", 10, 1);
    expect(result.isLongHire).toBe(true);
  });
});

describe("validatePostcode", () => {
  it("accepts valid UK postcodes", () => {
    expect(validatePostcode("BD1 1AA")).toBeNull();
    expect(validatePostcode("bd11aa")).toBeNull();
    expect(validatePostcode("LS1 4DY")).toBeNull();
  });

  it("rejects invalid postcodes", () => {
    expect(validatePostcode("")).not.toBeNull();
    expect(validatePostcode("not a postcode")).not.toBeNull();
    expect(validatePostcode("12345")).not.toBeNull();
  });
});

describe("validatePhone", () => {
  it("accepts valid UK mobile and landline formats", () => {
    expect(validatePhone("07453 112353")).toBeNull();
    expect(validatePhone("+447453112353")).toBeNull();
    expect(validatePhone("01274 123456")).toBeNull();
  });

  it("rejects invalid phone numbers", () => {
    expect(validatePhone("")).not.toBeNull();
    expect(validatePhone("123")).not.toBeNull();
    expect(validatePhone("not a phone")).not.toBeNull();
  });
});

describe("validateDates", () => {
  it("rejects past hire dates", () => {
    expect(validateDates("2000-01-01", "2000-01-02")).not.toBeNull();
  });

  it("rejects return dates before the hire date", () => {
    expect(validateDates("2026-12-15", "2026-12-14")).not.toBeNull();
  });

  it("accepts a valid date range", () => {
    expect(validateDates("2026-12-14", "2026-12-15")).toBeNull();
  });
});

describe("validateItems", () => {
  it("requires at least 1 chair or table", () => {
    expect(validateItems(0, 0)).not.toBeNull();
    expect(validateItems(1, 0)).toBeNull();
    expect(validateItems(0, 1)).toBeNull();
  });
});

describe("formatDateLong", () => {
  it("formats as e.g. Mon 14 Dec 2026", () => {
    expect(formatDateLong("2026-12-14")).toBe("Mon 14 Dec 2026");
  });
});

describe("buildWhatsAppMessage", () => {
  const base = {
    hireDate: "2026-12-14",
    returnDate: "2026-12-15",
    chairs: 30,
    tables: 2,
    name: "Aisha Khan",
    phone: "07123 456789",
    postcode: "BD1 1AA",
    address: "12 Example Street",
    delivery: "collect" as const,
    notes: "",
  };

  it("includes the standard total when hire is 2 days or fewer", () => {
    const message = buildWhatsAppMessage(base);
    expect(message).toContain("Hire total: £140");
    expect(message).toContain("Name: Aisha Khan");
    expect(message).toContain("Delivery & collection: No — I'll collect");
  });

  it("asks to confirm price on WhatsApp for hires longer than 2 days", () => {
    const message = buildWhatsAppMessage({ ...base, returnDate: "2026-12-17" });
    expect(message).toContain("Longer than 2 days — please confirm price");
  });

  it("omits the notes line when empty and includes it when present", () => {
    const withoutNotes = buildWhatsAppMessage(base);
    expect(withoutNotes).not.toContain("Notes:");

    const withNotes = buildWhatsAppMessage({ ...base, notes: "Side door access only" });
    expect(withNotes).toContain("Notes: Side door access only");
  });

  it("requests the delivery price when delivery is chosen", () => {
    const message = buildWhatsAppMessage({ ...base, delivery: "deliver" });
    expect(message).toContain("Delivery & collection: Yes — please send me the price");
  });

  it("builds a wa.me URL with the message URL-encoded", () => {
    const url = buildWhatsAppUrl(base);
    expect(url.startsWith("https://wa.me/447453112353?text=")).toBe(true);
    expect(url).toContain("Aisha%20Khan");
  });
});
