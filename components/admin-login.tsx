"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Admin
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the admin password to review submissions.
      </p>
      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {state.error && (
          <p className="text-sm font-medium text-primary">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
