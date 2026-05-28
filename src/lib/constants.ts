export const PROMPT_CATEGORIES = [
  "coding",
  "vibe",
  "image",
  "content",
  "roast",
  "study",
] as const;

export const TRENDING_WEIGHTS = {
  votes: 3,
  saves: 4,
  comments: 2,
  copies: 5,
  views: 0.2,
  ageHours: -0.5,
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vibedrop.com";

