import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    promptId?: string;
    commentId?: string;
    reason?: string;
  };

  if (!body.promptId && !body.commentId) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: auth.user.id,
    prompt_id: body.promptId ?? null,
    comment_id: body.commentId ?? null,
    reason: body.reason ?? "Reported by user",
  });

  if (error) {
    return NextResponse.json({ error: "Report failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
