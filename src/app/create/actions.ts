"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createPrompt(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const promptText = formData.get("promptText")?.toString().trim();
  const resultText = formData.get("resultText")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const tags = formData
    .get("tags")
    ?.toString()
    .split(",")
    .map((tag) => {
      let t = tag.trim();
      if (t.startsWith("#")) t = t.slice(1);
      return t;
    })
    .filter(Boolean);
  const remixOf = formData.get("remixOf")?.toString() ?? null;
  const thumbnailUrl = formData.get("thumbnailUrl")?.toString() || null;
  const thumbnailKey = formData.get("thumbnailKey")?.toString() || null;

  if (!title || !promptText || !category) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("prompts")
    .insert({
      title,
      prompt_text: promptText,
      result_text: resultText || null,
      category,
      tags: tags ?? [],
      user_id: auth.user.id,
      remix_of: remixOf || null,
      thumbnail_url: thumbnailUrl,
      thumbnail_key: thumbnailKey,
      image_url: thumbnailUrl, // Fallback for existing UI
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createPrompt error:", error);
    throw new Error(error?.message || "Failed to save prompt to database");
  }

  revalidatePath("/");
  redirect(`/prompts/${data.id}`);
}

export async function updatePrompt(promptId: string, formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const promptText = formData.get("promptText")?.toString().trim();
  const resultText = formData.get("resultText")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const tags = formData
    .get("tags")
    ?.toString()
    .split(",")
    .map((tag) => {
      let t = tag.trim();
      if (t.startsWith("#")) t = t.slice(1);
      return t;
    })
    .filter(Boolean);
  
  // These will be present if a new image was uploaded to R2
  const thumbnailUrl = formData.get("thumbnailUrl")?.toString() || null;
  const thumbnailKey = formData.get("thumbnailKey")?.toString() || null;

  if (!title || !promptText || !category) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  // Ensure the user owns the prompt before updating
  const { data: existingPrompt } = await supabase
    .from("prompts")
    .select("user_id, image_url, thumbnail_url, thumbnail_key")
    .eq("id", promptId)
    .single();

  if (!existingPrompt || existingPrompt.user_id !== auth.user.id) {
    return;
  }

  const newImageUrl = thumbnailUrl || existingPrompt.image_url;
  const newThumbnailUrl = thumbnailUrl || existingPrompt.thumbnail_url;
  const newThumbnailKey = thumbnailKey || existingPrompt.thumbnail_key;

  const { error } = await supabase
    .from("prompts")
    .update({
      title,
      prompt_text: promptText,
      result_text: resultText || null,
      category,
      tags: tags ?? [],
      image_url: newImageUrl,
      thumbnail_url: newThumbnailUrl,
      thumbnail_key: newThumbnailKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", promptId);

  if (error) {
    return;
  }

  revalidatePath("/");
  revalidatePath(`/prompts/${promptId}`);
  redirect(`/prompts/${promptId}`);
}

export async function deletePrompt(promptId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  // Soft delete or hard delete? We'll hard delete for now but ensure ownership
  const { error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", promptId)
    .eq("user_id", auth.user.id);

  if (!error) {
    revalidatePath("/");
    redirect("/");
  }
}
