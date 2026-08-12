"use client";

import { useActionState } from "react";
import { setPassword, type AuthState } from "@/app/auth/actions";

const initial: AuthState = {};

export default function WelcomePage() {
  const [state, formAction, pending] = useActionState(setPassword, initial);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">
        You&apos;re in — set a password
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Your email is verified. Choose a password so you can log back in and RSVP
        to hikes.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-on-surface">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </label>

        {state.error && <p className="text-sm text-error">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save password & continue"}
        </button>
      </form>
    </div>
  );
}
