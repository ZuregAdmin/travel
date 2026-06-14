import { getPool } from "./db";
import { deletePhoto, putPhoto } from "./s3";
import type { Trip, TripPhoto, TripStatus } from "./types";

// Trip metadata lives in Supabase Postgres; photo bytes live in S3.
// Public API is unchanged from the previous file-backed store so callers
// (pages, server actions) need no changes.

interface TripRow {
  id: string;
  status: TripStatus;
  country: string;
  city: string;
  author: string;
  title: string;
  story: string;
  goals: string;
  total_spent: number;
  photos: TripPhoto[];
  created_at: Date;
  reviewed_at: Date | null;
}

function rowToTrip(r: TripRow): Trip {
  return {
    id: r.id,
    status: r.status,
    country: r.country,
    city: r.city,
    author: r.author,
    title: r.title,
    story: r.story,
    goals: r.goals,
    totalSpent: r.total_spent,
    photos: r.photos,
    createdAt: r.created_at.toISOString(),
    ...(r.reviewed_at ? { reviewedAt: r.reviewed_at.toISOString() } : {}),
  };
}

const SELECT = `
  SELECT id, status, country, city, author, title, story, goals,
         total_spent, photos, created_at, reviewed_at
  FROM trips`;

export async function readTrips(): Promise<Trip[]> {
  const { rows } = await getPool().query<TripRow>(`${SELECT} ORDER BY created_at DESC`);
  return rows.map(rowToTrip);
}

export async function addTrip(trip: Trip): Promise<void> {
  await getPool().query(
    `INSERT INTO trips
       (id, status, country, city, author, title, story, goals,
        total_spent, photos, created_at, reviewed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      trip.id,
      trip.status,
      trip.country,
      trip.city,
      trip.author,
      trip.title,
      trip.story,
      trip.goals,
      trip.totalSpent,
      JSON.stringify(trip.photos),
      trip.createdAt,
      trip.reviewedAt ?? null,
    ]
  );
}

export async function setTripStatus(
  id: string,
  status: TripStatus
): Promise<void> {
  await getPool().query(
    `UPDATE trips SET status = $2, reviewed_at = $3 WHERE id = $1`,
    [id, status, new Date().toISOString()]
  );
}

export async function deleteTrip(id: string): Promise<void> {
  const trip = await getTrip(id);
  if (!trip) return;
  for (const photo of trip.photos) {
    await deletePhoto(photo.file).catch(() => {
      // Photo already gone or S3 unreachable; metadata removal still proceeds.
    });
  }
  await getPool().query(`DELETE FROM trips WHERE id = $1`, [id]);
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  const { rows } = await getPool().query<TripRow>(`${SELECT} WHERE id = $1`, [id]);
  return rows[0] ? rowToTrip(rows[0]) : undefined;
}

export async function approvedTrips(): Promise<Trip[]> {
  const { rows } = await getPool().query<TripRow>(
    `${SELECT} WHERE status = 'approved' ORDER BY created_at DESC`
  );
  return rows.map(rowToTrip);
}

export async function approvedTripsByCountry(code: string): Promise<Trip[]> {
  const { rows } = await getPool().query<TripRow>(
    `${SELECT} WHERE status = 'approved' AND country = $1 ORDER BY created_at DESC`,
    [code]
  );
  return rows.map(rowToTrip);
}

export async function pendingTrips(): Promise<Trip[]> {
  const { rows } = await getPool().query<TripRow>(
    `${SELECT} WHERE status = 'pending' ORDER BY created_at DESC`
  );
  return rows.map(rowToTrip);
}

export async function rejectedTrips(): Promise<Trip[]> {
  const { rows } = await getPool().query<TripRow>(
    `${SELECT} WHERE status = 'rejected' ORDER BY created_at DESC`
  );
  return rows.map(rowToTrip);
}

export async function savePhoto(
  name: string,
  bytes: Buffer,
  contentType: string
): Promise<void> {
  await putPhoto(name, bytes, contentType);
}
