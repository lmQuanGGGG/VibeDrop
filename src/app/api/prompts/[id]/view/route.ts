import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const resolvedParams = await params;

  const { error } = await supabase.rpc("increment_prompt_metric", {
    prompt_id: resolvedParams.id,
    field_name: "view_count",
  });

  if (error) {
    return NextResponse.json({ error: "Unable to update view count" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
