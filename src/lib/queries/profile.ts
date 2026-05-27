import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileRecord = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: "user" | "admin";
  created_at: string;
};

export async function getProfileByUsername(username: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role, created_at")
    .eq("username", username)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ProfileRecord;
}

export async function getProfilePrompts(profileId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, profiles(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .eq("user_id", profileId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}
