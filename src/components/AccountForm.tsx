"use client";

import { useActionState, useState } from "react";
import { updateProfile, type AccountState } from "@/app/account/actions";
import { Avatar } from "./Avatar";
import { ROLE_LABELS, type MemberRole } from "@/lib/types";

const initial: AccountState = {};
const inputClass =
  "rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none";

export function AccountForm({
  fullName,
  role,
  district,
  avatarUrl,
}: {
  fullName: string;
  role: MemberRole;
  district: string | null;
  avatarUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initial);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [removing, setRemoving] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar name={fullName} imageUrl={removing ? null : preview} size="lg" />
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-full border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container">
            {preview && !removing ? "Change photo" : "Upload photo"}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : avatarUrl);
                if (f) setRemoving(false);
              }}
            />
          </label>
          {avatarUrl && (
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                name="remove_avatar"
                checked={removing}
                onChange={(e) => setRemoving(e.target.checked)}
              />
              Remove current photo
            </label>
          )}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-on-surface">Name</span>
        <input name="full_name" defaultValue={fullName} required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-on-surface">Your role</span>
        <select name="role" defaultValue={role} className={inputClass}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-on-surface">District / school</span>
        <input
          name="district"
          defaultValue={district ?? ""}
          placeholder="Granite School District"
          className={inputClass}
        />
      </label>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.ok && <p className="text-sm text-secondary">Saved!</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
