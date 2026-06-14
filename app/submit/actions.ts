"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { TERMS_VERSION } from "@/lib/legal";
import { addTrip, removePhoto, savePhoto } from "@/lib/store";
import {
  PHOTO_CATEGORIES,
  type PhotoCategory,
  type TripPhoto,
} from "@/lib/types";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sanitizePhoto(
  bytes: Buffer,
  contentType: string
): Promise<Buffer> {
  const image = sharp(bytes, {
    failOn: "warning",
    limitInputPixels: MAX_IMAGE_PIXELS,
  }).rotate();

  if (contentType === "image/jpeg") {
    return image.jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  }
  if (contentType === "image/png") {
    return image.png({ compressionLevel: 9 }).toBuffer();
  }
  return image.webp({ quality: 90 }).toBuffer();
}

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
  const submitterEmail = String(formData.get("submitterEmail") ?? "")
    .trim()
    .toLowerCase();
  const totalSpent = Number(formData.get("totalSpent"));
  const ageConfirmed = formData.get("ageConfirmed") === "on";
  const rightsConfirmed = formData.get("rightsConfirmed") === "on";
  const privacyConfirmed = formData.get("privacyConfirmed") === "on";
  const termsConfirmed = formData.get("termsConfirmed") === "on";
  const communityConfirmed = formData.get("communityConfirmed") === "on";

  if (!author || !title || !city || !story || !goals) {
    return { error: "Please fill in every text field." };
  }
  if (
    author.length > 80 ||
    title.length > 120 ||
    city.length > 80 ||
    story.length > 10_000 ||
    goals.length > 3_000
  ) {
    return { error: "One or more fields exceed the allowed length." };
  }
  if (!EMAIL_PATTERN.test(submitterEmail) || submitterEmail.length > 254) {
    return { error: "Enter a valid contact email address." };
  }
  if (!COUNTRY_BY_CODE.has(countryCode)) {
    return { error: "Please pick a country from the list." };
  }
  if (
    !Number.isSafeInteger(totalSpent) ||
    totalSpent < 0 ||
    totalSpent > 100_000_000
  ) {
    return {
      error: "Total spent must be a whole number from 0 to 100,000,000.",
    };
  }
  if (!ageConfirmed) {
    return { error: "You must be at least 18 years old to submit content." };
  }
  if (!rightsConfirmed) {
    return { error: "Confirm that you have the right to share this content." };
  }
  if (!privacyConfirmed || !termsConfirmed || !communityConfirmed) {
    return {
      error:
        "Review and accept the Privacy Notice, Terms, and Community Guidelines.",
    };
  }

  const id = randomUUID();
  const photos: TripPhoto[] = [];
  const saves: { name: string; bytes: Buffer; contentType: string }[] = [];

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
    let bytes: Buffer;
    try {
      bytes = await sanitizePhoto(
        Buffer.from(await file.arrayBuffer()),
        file.type
      );
    } catch {
      return { error: `Photo ${i + 1} could not be processed as a valid image.` };
    }
    if (bytes.length > MAX_PHOTO_BYTES) {
      return {
        error: `Photo ${i + 1} is still over 8 MB after privacy processing.`,
      };
    }

    saves.push({ name, bytes, contentType: file.type });
    photos.push({ file: name, category });
  }

  if (photos.length === 0) {
    return { error: "Add at least one photo (up to 8)." };
  }

  const consentedAt = new Date().toISOString();
  const uploaded: string[] = [];
  try {
    for (const save of saves) {
      await savePhoto(save.name, save.bytes, save.contentType);
      uploaded.push(save.name);
    }

    await addTrip(
      {
        id,
        status: "pending",
        country: countryCode,
        city,
        author,
        title,
        story,
        goals,
        totalSpent,
        photos,
        createdAt: consentedAt,
      },
      {
        submitterEmail,
        consentedAt,
        termsVersion: TERMS_VERSION,
        attestations: {
          ageConfirmed: true,
          rightsConfirmed: true,
          privacyConfirmed: true,
          termsConfirmed: true,
          communityConfirmed: true,
        },
      }
    );
  } catch (error) {
    await Promise.allSettled(uploaded.map((name) => removePhoto(name)));
    console.error(
      JSON.stringify({
        level: "error",
        at: "submitTrip.persist",
        submissionId: id,
        error: error instanceof Error ? error.name : "UnknownError",
      })
    );
    return {
      error:
        "We could not save your submission. No submission was created; please try again.",
    };
  }

  redirect(`/submit/thanks?reference=${encodeURIComponent(id)}`);
}
