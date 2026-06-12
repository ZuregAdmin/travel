"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { addTrip, savePhoto } from "@/lib/store";
import {
  PHOTO_CATEGORIES,
  type PhotoCategory,
  type TripPhoto,
} from "@/lib/types";

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface SubmitState {
  error?: string;
}

export async function submitTrip(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const author = String(formData.get("author") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const countryCode = String(formData.get("country") ?? "")
    .trim()
    .toUpperCase();
  const city = String(formData.get("city") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const goals = String(formData.get("goals") ?? "").trim();
  const totalSpent = Number(formData.get("totalSpent"));

  if (!author || !title || !city || !story || !goals) {
    return { error: "Please fill in every text field." };
  }
  if (!COUNTRY_BY_CODE.has(countryCode)) {
    return { error: "Please pick a country from the list." };
  }
  if (!Number.isFinite(totalSpent) || totalSpent < 0) {
    return { error: "Total spent must be a number (0 or more)." };
  }

  const id = randomUUID();
  const photos: TripPhoto[] = [];
  const saves: { name: string; bytes: Buffer }[] = [];

  for (let i = 0; i < MAX_PHOTOS; i++) {
    const file = formData.get(`photo-${i}`);
    if (!(file instanceof File) || file.size === 0) continue;

    const ext = EXT_BY_MIME[file.type];
    if (!ext) {
      return {
        error: `Photo ${i + 1}: only JPEG, PNG, or WebP images are accepted.`,
      };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: `Photo ${i + 1} is over the 8 MB limit.` };
    }

    const category = String(formData.get(`category-${i}`) ?? "") as PhotoCategory;
    if (!PHOTO_CATEGORIES.includes(category)) {
      return { error: `Photo ${i + 1}: pick a category.` };
    }

    const name = `${id}-${i}.${ext}`;
    saves.push({ name, bytes: Buffer.from(await file.arrayBuffer()) });
    photos.push({ file: name, category });
  }

  if (photos.length === 0) {
    return { error: "Add at least one photo (up to 4)." };
  }

  for (const save of saves) {
    await savePhoto(save.name, save.bytes);
  }

  await addTrip({
    id,
    status: "pending",
    country: countryCode,
    city,
    author,
    title,
    story,
    goals,
    totalSpent: Math.round(totalSpent),
    photos,
    createdAt: new Date().toISOString(),
  });

  redirect("/submit/thanks");
}
