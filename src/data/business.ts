// Single source of truth for every business fact used across the site.
// Change a price, phone number or area here — nothing else needs touching.

export const business = {
  name: "The Chairs Room",
  strapline: "Chair & table hire in Bradford and Leeds",

  phoneDisplay: "07453 112353",
  phoneHref: "tel:+447453112353",
  whatsappNumber: "447453112353", // international format, no plus, for wa.me links

  collectionTown: "Bradford",

  areas: [
    "Bradford",
    "Leeds",
    "Halifax",
    "Huddersfield",
    "Wakefield",
    "Keighley",
    "Shipley",
    "Bingley",
    "Dewsbury",
    "Batley",
  ],
  region: "West Yorkshire",

  stock: {
    maxChairs: 40,
    maxTables: 4,
  },

  pricing: {
    chairPrice: 4,
    tablePrice: 10,
    fullSetPrice: 200, // 40 chairs + 4 tables
    currencySymbol: "£",
  },

  hire: {
    minDays: 1,
    maxStandardDays: 2, // beyond this, price is confirmed on WhatsApp
  },

  social: {
    instagram: "https://instagram.com/thechairsroom", // PLACEHOLDER — confirm real handle
  },

  // Update this alongside astro.config.mjs `site` and public/robots.txt
  // once the Cloudflare Pages / custom domain URL is final.
  siteUrl: "https://thechairsroom.pages.dev",

  seo: {
    titleHome: "Chair & Table Hire Bradford & Leeds | The Chairs Room",
    titleBook: "Book Your Chairs | The Chairs Room",
    titleTerms: "Hire Terms | The Chairs Room",
    descriptionHome:
      "Wooden chiavari chairs and 6ft tables for hire across Bradford, Leeds and West Yorkshire. £4 a chair, £10 a table. Collect from Bradford, or we'll deliver.",
    descriptionBook:
      "Pick your chairs, tables and dates, then send your booking request straight to WhatsApp.",
    descriptionTerms: "Plain-English hire terms for The Chairs Room.",
  },
} as const;

export type Business = typeof business;
