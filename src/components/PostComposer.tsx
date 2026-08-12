"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPost, type FeedActionState } from "@/app/community/actions";
import { Avatar } from "./Avatar";

const initial: FeedActionState = {};

const STARTERS = [
  { label: "👋 Introduce yourself", text: "Hi everyone! I'm " },
  { label: "📸 Share a trail photo", text: "" },
  { label: "🥾 Trip report", text: "Trip report: " },
  { label: "🚗 Offer a carpool", text: "I can carpool to the next hike from " },
];

export function PostComposer({
  authorName,
  avatarUrl,
}: {
  authorName: string;
  avatarUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(createPost, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setFileName(null);
    }
  }, [state.ok]);

  function useStarter(text: string, wantPhoto: boolean) {
    if (wantPhoto) fileRef.current?.click();
    if (textRef.current) {
      textRef.current.value = text;
      textRef.current.focus();
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <Avatar name={authorName} imageUrl={avatarUrl} />
        <textarea
          ref={textRef}
          name="body"
          rows={3}
          maxLength={5000}
          placeholder={`Share something with the group, ${authorName.split(" ")[0] || "friend"}…`}
          className="flex-1 resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => useStarter(s.text, s.label.includes("photo"))}
            className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-surface-container-highest pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
          <span aria-hidden>📷</span>
          <span>{fileName ? fileName : "Add a photo"}</span>
          <input
            ref={fileRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post"}
        </button>
      </div>

      {state.error && <p className="mt-2 text-sm text-error">{state.error}</p>}
    </form>
  );
}
