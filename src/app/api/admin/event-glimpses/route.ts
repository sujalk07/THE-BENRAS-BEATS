import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_glimpses")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Glimpses fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch glimpses" }, { status: 500 });
    }

    return NextResponse.json({ glimpses: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, media_type, media_url, caption, display_order } = body;

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!media_url) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_glimpses")
      .insert({
        media_type: media_type ?? "image",
        media_url,
        caption: caption ?? "",
        display_order: display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Glimpse create error:", error);
      return NextResponse.json({ error: "Failed to create glimpse" }, { status: 500 });
    }

    return NextResponse.json({ success: true, glimpse: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}