"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const displayName = formData.get("displayName")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const avatarUrl = formData.get("avatarUrl")?.toString().trim() || null;

  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    throw new Error("Unauthorized");
  }

  // Fetch username to revalidate the correct path
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", auth.user.id)
    .single();

  if (fetchError || !profile) {
    throw new Error("Profile not found");
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio: bio,
      avatar_url: avatarUrl,
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("updateProfile error:", updateError);
    throw new Error(updateError.message || "Failed to update profile");
  }

  revalidatePath(`/profile/${profile.username}`);
  revalidatePath("/");
}
