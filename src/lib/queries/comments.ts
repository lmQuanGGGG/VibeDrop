import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CommentRecord = {
  id: string;
  user_id: string;
  prompt_id: string;
  content: string;
  parent_id: string | null;
  status: "active" | "hidden" | "deleted";
  created_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export async function getPromptComments(promptId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, user_id, prompt_id, content, parent_id, status, created_at, profiles(id, username, display_name, avatar_url)"
    )
    .eq("prompt_id", promptId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [] as CommentRecord[];
  }

  const normalized = data.map((row) => ({
    ...row,
    profiles: Array.isArray(row.profiles)
      ? row.profiles[0] ?? null
      : row.profiles ?? null,
  }));

  return normalized as CommentRecord[];
}
