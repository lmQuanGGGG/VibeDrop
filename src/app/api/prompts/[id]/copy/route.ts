import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.rpc("increment_prompt_metric", {
    prompt_id: id,
    field_name: "copy_count",
  });

  if (error) {
    return NextResponse.json({ error: "Unable to update copy count" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
