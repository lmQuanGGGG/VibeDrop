import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Security check: Only allow deleting files belonging to the authenticated user
    // Expected key format: "folder/{userId}/filename.ext"
    const parts = key.split("/");
    if (parts.length < 3 || parts[1] !== auth.user.id) {
      return NextResponse.json({ error: "Unauthorized access to object key" }, { status: 403 });
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting object:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
