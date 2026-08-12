"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitRsvp, cancelRsvp, type ActionResult } from "@/app/hikes/[id]/actions";
import type { Rsvp } from "@/lib/types";

const initial: ActionResult = {};

export function RsvpPanel({
  hikeId,
  isAuthed,
  rsvp,
}: {
  hikeId: string;
  isAuthed: boolean;
  rsvp: Pick<Rsvp, "guests" | "carpool"> | null;
}) {
  const action = submitRsvp.bind(null, hikeId);
  const [state, formAction, pending] = useActionState(action, initial);

  if (!isAuthed) {
    return (
      <div className="rounded-xl border border-primary/20 bg-surface-bright p-5">
        <h3 className="font-display text-lg font-bold text-on-surface">
          Join this hike
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Log in or join the community to RSVP.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/login"
            className="rounded-full border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            Log in
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container"
          >
            Join
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-surface-container-lowest p-5">
      <h3 className="font-display text-lg font-bold text-on-surface">
        {rsvp ? "You're going 🎉" : "Join this hike"}
      </h3>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-on-surface">Guests</span>
          <select
            name="guests"
            defaultValue={String(rsvp?.guests ?? 0)}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="0">Just me</option>
            <option value="1">Me + 1</option>
            <option value="2">Me + 2</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-on-surface">Carpool</span>
          <select
            name="carpool"
            defaultValue={rsvp?.carpool ?? "meet_there"}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="drive">I can drive</option>
            <option value="need_ride">I need a ride</option>
            <option value="meet_there">I&apos;ll meet there</option>
          </select>
        </label>

        {state.error && <p className="text-sm text-error">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Saving…" : rsvp ? "Update RSVP" : "RSVP"}
        </button>
      </form>

      {rsvp && (
        <form action={cancelRsvp.bind(null, hikeId)} className="mt-2">
          <button
            type="submit"
            className="w-full rounded-full border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container"
          >
            Cancel RSVP
          </button>
        </form>
      )}
    </div>
  );
}
