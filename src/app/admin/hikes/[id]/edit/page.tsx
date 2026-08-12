import { notFound, redirect } from "next/navigation";
import { HikeForm } from "@/components/HikeForm";
import { updateHike } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Hike } from "@/lib/types";

export const metadata = { title: "Edit hike — Utah Trail Mix" };

/** ISO → "YYYY-MM-DDTHH:mm" in Denver time for datetime-local inputs. */
function toLocalInput(iso: string): string {
  const s = new Date(iso).toLocaleString("sv-SE", {
    timeZone: "America/Denver",
  });
  return s.replace(" ", "T").slice(0, 16);
}

export default async function EditHikePage(props: PageProps<"/admin/hikes/[id]/edit">) {
  const { id } = await props.params;
  const { error } = await props.searchParams;

  if (!isSupabaseConfigured) redirect("/admin");

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

  const { data: hike } = await supabase
    .from("hikes")
    .select("*")
    .eq("id", id)
    .maybeSingle<Hike>();
  if (!hike) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">Edit hike</h1>
      {error && <p className="mt-3 text-sm text-error">{String(error)}</p>}
      <div className="mt-8">
        <HikeForm
          action={updateHike.bind(null, id)}
          hike={hike}
          defaultStartsAt={toLocalInput(hike.starts_at)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
