export const PHOTO_CATEGORIES = [
  "travel",
  "food",
  "activities",
  "accommodations",
  "scenery",
] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  travel: "✈️ Travel",
  food: "🍜 Food",
  activities: "🥾 Activities",
  accommodations: "🛏️ Accommodations",
  scenery: "🏞️ Scenery",
};

export interface TripPhoto {
  file: string;
  category: PhotoCategory;
}

export type TripStatus = "pending" | "approved" | "rejected";

export interface Trip {
  id: string;
  status: TripStatus;
  country: string; // ISO 3166-1 alpha-2 code
  city: string;
  author: string;
  title: string;
  story: string; // what they did
  goals: string; // goals of the trip
  totalSpent: number; // USD, excludes souvenirs
  photos: TripPhoto[];
  createdAt: string; // ISO timestamp
  reviewedAt?: string;
}
