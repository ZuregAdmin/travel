"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitTrip, type SubmitState } from "@/app/submit/actions";
import { PHOTO_CATEGORIES, PHOTO_CATEGORY_LABELS } from "@/lib/types";

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function PhotoSlot({ index }: { index: number }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm font-medium">
        Photo {index + 1}
        {index === 0 ? (
          <span className="text-primary"> *</span>
        ) : (
          <span className="text-muted-foreground"> (optional)</span>
        )}
      </p>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={`Photo ${index + 1} preview`}
          className="mb-3 aspect-[3/2] w-full rounded-md object-cover"
        />
      )}
      <input
        type="file"
        name={`photo-${index}`}
        accept="image/jpeg,image/png,image/webp"
        required={index === 0}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-border"
      />
      <select
        name={`category-${index}`}
        defaultValue=""
        required={index === 0}
        className={`${inputClass} mt-3`}
      >
        <option value="" disabled>
          Category…
        </option>
        {PHOTO_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {PHOTO_CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SubmitForm({ countries }: { countries: CountryOption[] }) {
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    submitTrip,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Public display name
          </span>
          <input name="author" required maxLength={80} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Contact email
          </span>
          <input
            name="submitterEmail"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Private. Used only for moderation, rights, and privacy requests.
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Trip title</span>
          <input
            name="title"
            required
            maxLength={120}
            placeholder="A week of street food in Bangkok"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Country</span>
          <select name="country" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Pick a country…
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">City</span>
          <input name="city" required maxLength={80} className={inputClass} />
        </label>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">
          Photos <span className="text-muted-foreground">(1–8, each tagged with a category)</span>
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Categories: travel, food, activities, accommodations, scenery. JPEG,
          PNG, or WebP, up to 8 MB each. We re-encode uploads to remove embedded
          metadata such as GPS coordinates.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <PhotoSlot key={i} index={i} />
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">
          What did you do?
        </span>
        <textarea
          name="story"
          required
          rows={8}
          maxLength={10000}
          placeholder="Tell the story of your trip — where you went, what you ate, what surprised you…"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">
          What were the goals of your trip?
        </span>
        <textarea
          name="goals"
          required
          rows={4}
          maxLength={3000}
          placeholder="Relaxation? Adventure? Visiting family? Eating everything in sight?"
          className={inputClass}
        />
      </label>

      <label className="block sm:max-w-xs">
        <span className="mb-1.5 block text-sm font-medium">
          Total spent in USD{" "}
          <span className="text-muted-foreground">(excluding souvenirs)</span>
        </span>
        <input
          name="totalSpent"
          type="number"
          min={0}
          step={1}
          required
          placeholder="1500"
          className={inputClass}
        />
      </label>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-semibold">
          Submission agreements
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Do not include home addresses, booking numbers, passport details,
          financial information, or other sensitive personal information.
        </p>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="ageConfirmed"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>I confirm that I am at least 18 years old.</span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="rightsConfirmed"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              I created this story and these photos, or I have permission to
              publish them. I also have permission from identifiable people
              shown, including a parent or guardian for any minor.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="communityConfirmed"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              My submission follows the{" "}
              <Link
                href="/community-guidelines"
                target="_blank"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Community Guidelines
              </Link>
              .
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="privacyConfirmed"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              I have read the{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Privacy Notice
              </Link>
              , including how public submissions and private contact details
              are handled.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="termsConfirmed"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Terms of Use
              </Link>
              , including the license needed to display and promote my
              submission.
            </span>
          </label>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Submit for review"}
        </button>
        <p className="text-xs text-muted-foreground">
          Submissions are moderated and may be rejected or removed.
        </p>
      </div>
    </form>
  );
}
