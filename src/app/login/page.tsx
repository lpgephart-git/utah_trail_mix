"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithPassword, type AuthState } from "@/app/auth/actions";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInWithPassword, initial);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">
        Welcome back
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Log in to RSVP and join the conversation on upcoming hikes.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-on-surface">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@school.edu"
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-on-surface">Password</span>
          <input
            name="password"
            type="password"
            required
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface focus:border-primary focus:outline-none"
          />
        </label>

        {state.error && <p className="text-sm text-error">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>

        <p className="text-center text-sm text-on-surface-variant">
          New here?{" "}
          <Link href="/join" className="font-medium text-primary hover:underline">
            Join the community
          </Link>
        </p>
      </form>
    </div>
  );
}
