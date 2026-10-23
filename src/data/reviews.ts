// Real WhatsApp reviews go here — first names only, no phone numbers.
// Every entry below is a placeholder. The build logs a warning until they're replaced.

export interface Review {
  name: string;
  text: string;
  date: string; // e.g. "14 Jun 2026"
  placeholder?: boolean;
}

export const reviews: Review[] = [
  {
    name: "Sana",
    text: "PLACEHOLDER — replace with real review. Chairs were spotless and Muaz dropped them off right on time, thank you!",
    date: "PLACEHOLDER",
    placeholder: true,
  },
  {
    name: "Imran",
    text: "PLACEHOLDER — replace with real review. Easy to sort out on WhatsApp, good price for the full set.",
    date: "PLACEHOLDER",
    placeholder: true,
  },
  {
    name: "Fatima",
    text: "PLACEHOLDER — replace with real review. Used them for our mehndi, chairs looked lovely with our setup.",
    date: "PLACEHOLDER",
    placeholder: true,
  },
  {
    name: "Yusuf",
    text: "PLACEHOLDER — replace with real review. Collection from Bradford was simple, no hassle at all.",
    date: "PLACEHOLDER",
    placeholder: true,
  },
];

export const hasPlaceholderReviews = reviews.some((r) => r.placeholder);

if (hasPlaceholderReviews && import.meta.env.PROD) {
  console.warn(
    "[The Chair Room] WARNING: placeholder reviews are still in src/data/reviews.ts. Replace them with real customer reviews before launch.",
  );
}
