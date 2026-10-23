# The Chairs Room

Chair & table hire in Bradford and Leeds. Static site built with Astro,
plain CSS and a small vanilla TypeScript booking form — no backend,
no database, no email service. Booking requests are sent to WhatsApp.

## Commands

| Command         | Action                                      |
| :--------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start the local dev server at `:4321`       |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |
| `npm test`        | Run the booking-logic unit tests (Vitest)   |

## Where things live

- `src/data/business.ts` — every business fact (name, phone, prices, stock
  limits, areas). Change a price here, nothing else.
- `src/data/reviews.ts` — customer reviews. Replace the placeholders before
  launch; the build logs a warning if any remain.
- `src/lib/booking-logic.ts` — pure pricing/validation/WhatsApp-message
  logic, framework-free and unit tested in `tests/`.
- `src/components/BookingForm.astro` — the `/book` page form and its
  client-side wiring.
- `PHOTOS.md` — exact file names/paths to drop real photos into.
- `PHOTO-CREDITS.md` — photo sourcing notes.

## Deploying

Static output, deployed on Cloudflare Pages with automatic deploys from
`main`. Build command: `npm run build`. Output directory: `dist`.
