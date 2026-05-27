import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("saved_prompts").upsert({
    prompt_id: id,
    user_id: auth.user.id,
  });

  if (error) {
    return NextResponse.json({ error: "Save failed" }, { status: 400 });
  }

  await supabase.rpc("adjust_prompt_save_count", {
    prompt_id: id,
    delta: 1,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("saved_prompts")
    .delete()
    .eq("prompt_id", id)
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: "Unsave failed" }, { status: 400 });
  }

  await supabase.rpc("adjust_prompt_save_count", {
    prompt_id: id,
    delta: -1,
  });

  return NextResponse.json({ ok: true });
}
