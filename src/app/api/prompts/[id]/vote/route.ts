import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { value } = (await request.json()) as { value: number };

  if (![1, 0, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  if (value === 0) {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("prompt_id", id)
      .eq("user_id", auth.user.id);

    if (error) {
      return NextResponse.json({ error: "Vote reset failed" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from("votes").upsert(
    {
      prompt_id: id,
      user_id: auth.user.id,
      value,
    },
    { onConflict: "user_id,prompt_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Vote failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
