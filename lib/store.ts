import { promises as fs } from "fs";
import path from "path";
import { deletePhoto, putPhoto } from "./s3";
import type { Trip, TripStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const TRIPS_FILE = path.join(DATA_DIR, "trips.json");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readTrips(): Promise<Trip[]> {
  try {
    const raw = await fs.readFile(TRIPS_FILE, "utf8");
    return JSON.parse(raw) as Trip[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeTrips(trips: Trip[]): Promise<void> {
  await ensureDataDir();
  const tmp = TRIPS_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(trips, null, 2), "utf8");
  await fs.rename(tmp, TRIPS_FILE);
}

export async function addTrip(trip: Trip): Promise<void> {
  const trips = await readTrips();
  trips.push(trip);
  await writeTrips(trips);
}

export async function setTripStatus(
  id: string,
  status: TripStatus
): Promise<void> {
  const trips = await readTrips();
  const trip = trips.find((t) => t.id === id);
  if (!trip) return;
  trip.status = status;
  trip.reviewedAt = new Date().toISOString();
  await writeTrips(trips);
}

export async function deleteTrip(id: string): Promise<void> {
  const trips = await readTrips();
  const trip = trips.find((t) => t.id === id);
  if (!trip) return;
  for (const photo of trip.photos) {
    await deletePhoto(photo.file).catch(() => {
      // Photo already gone or S3 unreachable; metadata removal still proceeds.
    });
  }
  await writeTrips(trips.filter((t) => t.id !== id));
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  const trips = await readTrips();
  return trips.find((t) => t.id === id);
}

function newestFirst(a: Trip, b: Trip): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export async function approvedTrips(): Promise<Trip[]> {
  return (await readTrips()).filter((t) => t.status === "approved").sort(newestFirst);
}

export async function approvedTripsByCountry(code: string): Promise<Trip[]> {
  return (await approvedTrips()).filter((t) => t.country === code);
}

export async function pendingTrips(): Promise<Trip[]> {
  return (await readTrips()).filter((t) => t.status === "pending").sort(newestFirst);
}

export async function rejectedTrips(): Promise<Trip[]> {
  return (await readTrips()).filter((t) => t.status === "rejected").sort(newestFirst);
}

export async function savePhoto(
  name: string,
  bytes: Buffer,
  contentType: string
): Promise<void> {
  await putPhoto(name, bytes, contentType);
}
