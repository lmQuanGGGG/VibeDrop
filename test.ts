import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.log("Missing env vars");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Get first user
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users.users[0]?.id;
  if (!userId) {
    console.log("No users found");
    return;
  }

  // 2. Insert prompt
  const { data: inserted, error: insertError } = await supabase
    .from("prompts")
    .insert({
      title: "Test prompt from server",
      prompt_text: "Testing 123",
      category: "test",
      user_id: userId,
    })
    .select("id")
    .single();

  if (insertError) {
    console.log("Insert Error:", insertError);
    return;
  }

  console.log("Inserted ID:", inserted.id);

  // 3. Fetch prompt as public
  const { data: fetched, error: fetchError } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, profiles(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .eq("id", inserted.id)
    .single();

  if (fetchError) {
    console.log("Fetch Error:", fetchError);
  } else {
    console.log("Fetched Prompt Successfully:", fetched.id);
  }

  // Cleanup
  await supabase.from("prompts").delete().eq("id", inserted.id);
}

test();
