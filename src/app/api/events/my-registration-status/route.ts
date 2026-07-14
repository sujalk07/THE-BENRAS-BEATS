import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");

    if (!userId || !eventId) {
      return NextResponse.json({ error: "Missing userId or eventId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_registration_requests")
      .select("id, status, admin_note, created_at")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Registration status fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
    }

    return NextResponse.json({ request: data ?? null });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}