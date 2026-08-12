import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatHikeDate } from "@/lib/format";
import { deleteHike } from "./actions";
import type { Hike } from "@/lib/types";

export const metadata = { title: "Admin — Utah Trail Mix" };

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-on-surface">Admin</h1>
        <p className="mt-3 text-on-surface-variant">
          Connect Supabase to manage hikes. See <code>docs/README</code> for setup.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) redirect("/");

  const { data: hikes } = await supabase
    .from("hikes")
    .select("*")
    .order("starts_at", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-on-surface">
          Manage hikes
        </h1>
        <Link
          href="/admin/hikes/new"
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-container"
        >
          + New hike
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(hikes ?? []).map((hike: Hike) => (
          <div
            key={hike.id}
            className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-container-lowest p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-on-surface">{hike.title}</span>
                <StatusPill status={hike.status} />
              </div>
              <p className="text-sm text-on-surface-variant">
                {formatHikeDate(hike.starts_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/hikes/${hike.id}/edit`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Edit
              </Link>
              <form action={deleteHike.bind(null, hike.id)}>
                <button
                  type="submit"
                  className="text-sm font-medium text-error hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {(!hikes || hikes.length === 0) && (
          <p className="text-on-surface-variant">
            No hikes yet — create your first one.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isPub = status === "published";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isPub
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-variant text-on-surface-variant"
      }`}
    >
      {isPub ? "Published" : "Draft"}
    </span>
  );
}
