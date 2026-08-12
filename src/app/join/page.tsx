"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestSignupLink, type AuthState } from "@/app/auth/actions";
import { ROLE_LABELS } from "@/lib/types";

const initial: AuthState = {};

export default function JoinPage() {
  const [state, formAction, pending] = useActionState(requestSignupLink, initial);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">
        Join the community
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Connect with Utah educators focused on wellness and the outdoors. We&apos;ll
        email you a link to confirm your address and set a password.
      </p>

      {state.sent ? (
        <div className="mt-8 rounded-xl border border-secondary/40 bg-secondary-container/40 p-6">
          <p className="font-display text-lg font-bold text-on-secondary-container">
            Check your email
          </p>
          <p className="mt-1 text-on-surface-variant">
            We sent you a verification link. Open it to finish setting up your
            account and choose a password.
          </p>
        </div>
      ) : (
        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <Field label="Full name" name="full_name" placeholder="Jane Doe" required />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="jane@school.edu"
            required
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-on-surface">
              Your role at your school / district
            </span>
            <select
              name="role"
              defaultValue="teacher"
              className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface focus:border-primary focus:outline-none"
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="District / school"
            name="district"
            placeholder="Granite School District"
          />

          {state.error && (
            <p className="text-sm text-error">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
          >
            {pending ? "Sending…" : "Count me in"}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Already a member?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-on-surface">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
      />
    </label>
  );
}
