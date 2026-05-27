"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createComment(formData: FormData) {
  const promptId = formData.get("promptId")?.toString();
  const content = formData.get("content")?.toString().trim();
  const parentId = formData.get("parentId")?.toString() || null;

  if (!promptId || !content) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return;
  }

  const { error } = await supabase.from("comments").insert({
    prompt_id: promptId,
    user_id: auth.user.id,
    content,
    parent_id: parentId,
  });

  if (!error) {
    revalidatePath(`/prompts/${promptId}`);
  }
}
