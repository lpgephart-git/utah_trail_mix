"use client";

import { useActionState, useEffect, useRef } from "react";
import { postComment, type ActionResult } from "@/app/hikes/[id]/actions";

const initial: ActionResult = {};

export function CommentForm({ hikeId }: { hikeId: string }) {
  const action = postComment.bind(null, hikeId);
  const [state, formAction, pending] = useActionState(action, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <textarea
        name="body"
        rows={3}
        required
        maxLength={2000}
        placeholder="Ask a question, offer a carpool, say hi…"
        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
      />
      {state.error && <p className="text-sm text-error">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
