"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error?: string };

/**
 * Instant email + password signup. With "Confirm email" turned OFF in Supabase
 * (Authentication → Providers → Email), signUp returns a session immediately —
 * no verification email, no rate limit, no link scanners. The handle_new_user
 * trigger creates the profile from the signup metadata.
 */
export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: "Sign-ups aren't live yet — connect Supabase first." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "other");
  const district = String(formData.get("district") ?? "").trim();

  if (!email || !full_name) return { error: "Please add your name and email." };
  if (password.length < 8) {
    return { error: "Use a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role, district: district || null } },
  });
  if (error) return { error: error.message };

  // If no session came back, email confirmation is still enabled in Supabase.
  if (!data.session) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInErr) {
      return {
        error:
          "Account created, but Supabase still has email confirmation on. Turn off Authentication → Providers → Email → “Confirm email” for instant sign-in.",
      };
    }
  }

  redirect("/");
}

/** Log in with email + password. */
export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: "Login isn't live yet — connect Supabase first." };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
