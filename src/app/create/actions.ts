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
    .map((tag) => tag.trim())
    .filter(Boolean);
  const remixOf = formData.get("remixOf")?.toString() ?? null;
  const previewFile = formData.get("preview") as File | null;

  if (!title || !promptText || !category) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  let imageUrl: string | null = null;
  
  if (previewFile && previewFile.size > 0) {
    // Generate unique filename
    const fileExt = previewFile.name.split('.').pop();
    const fileName = `${auth.user.id}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('prompts')
      .upload(fileName, previewFile);
      
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('prompts')
        .getPublicUrl(uploadData.path);
        
      imageUrl = publicUrlData.publicUrl;
    }
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
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createPrompt error:", error);
    return;
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
    .map((tag) => tag.trim())
    .filter(Boolean);
  const previewFile = formData.get("preview") as File | null;

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
    .select("user_id, image_url")
    .eq("id", promptId)
    .single();

  if (!existingPrompt || existingPrompt.user_id !== auth.user.id) {
    return;
  }

  let imageUrl: string | null = existingPrompt.image_url;
  
  if (previewFile && previewFile.size > 0) {
    const fileExt = previewFile.name.split('.').pop();
    const fileName = `${auth.user.id}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('prompts')
      .upload(fileName, previewFile);
      
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('prompts')
        .getPublicUrl(uploadData.path);
        
      imageUrl = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase
    .from("prompts")
    .update({
      title,
      prompt_text: promptText,
      result_text: resultText || null,
      category,
      tags: tags ?? [],
      image_url: imageUrl,
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
