import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  // Kiểm tra xem người dùng có phải chủ bài không
  const { data: auth } = await supabase.auth.getUser();
  if (auth.user) {
    const { data: prompt } = await supabase
      .from("prompts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (prompt && prompt.user_id === auth.user.id) {
      // Chủ bài không được tự buff copy_count
      return NextResponse.json({ ok: true, skipped: true });
    }
  }

  const { error } = await supabase.rpc("increment_prompt_metric", {
    prompt_id: id,
    field_name: "copy_count",
  });

  if (error) {
    return NextResponse.json({ error: "Unable to update copy count" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
