"use client";

import { useActionState, useEffect, useRef } from "react";
import { addReply, type FeedActionState } from "@/app/community/actions";

const initial: FeedActionState = {};

export function ReplyForm({ postId }: { postId: string }) {
  const action = addReply.bind(null, postId);
  const [state, formAction, pending] = useActionState(action, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="mt-3 flex items-start gap-2">
      <input
        name="body"
        maxLength={2000}
        placeholder="Write a reply…"
        className="flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-surface-container px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high disabled:opacity-60"
      >
        {pending ? "…" : "Reply"}
      </button>
      {state.error && <p className="text-sm text-error">{state.error}</p>}
    </form>
  );
}
