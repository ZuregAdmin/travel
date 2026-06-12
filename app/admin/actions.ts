"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken, isAdmin, passwordMatches } from "@/lib/auth";
import { deleteTrip, setTripStatus } from "@/lib/store";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    return { error: "Wrong password." };
  }
  (await cookies()).set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
}

export async function approveTrip(id: string): Promise<void> {
  await requireAdmin();
  await setTripStatus(id, "approved");
  revalidatePath("/", "layout");
}

export async function rejectTrip(id: string): Promise<void> {
  await requireAdmin();
  await setTripStatus(id, "rejected");
  revalidatePath("/", "layout");
}

export async function removeTrip(id: string): Promise<void> {
  await requireAdmin();
  await deleteTrip(id);
  revalidatePath("/", "layout");
}
