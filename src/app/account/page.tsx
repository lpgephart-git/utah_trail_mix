import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { avatarUrl } from "@/lib/storage";
import { AccountForm } from "@/components/AccountForm";

export const metadata = { title: "Your profile — Utah Trail Mix" };

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/account");

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">Your profile</h1>
      <p className="mt-2 text-on-surface-variant">
        Add a photo so folks recognize you on the trail. All optional — a photo is
        never required.
      </p>
      <div className="mt-8">
        <AccountForm
          fullName={profile.full_name}
          role={profile.role}
          district={profile.district}
          avatarUrl={avatarUrl(profile.avatar_path)}
        />
      </div>
    </div>
  );
}
