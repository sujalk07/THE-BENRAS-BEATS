// src/app/api/admin/event-glimpses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userId, media_type, media_url, caption, display_order } = body;

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_glimpses")
      .update({ media_type, media_url, caption, display_order })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Glimpse update error:", error);
      return NextResponse.json({ error: "Failed to update glimpse" }, { status: 500 });
    }

    return NextResponse.json({ success: true, glimpse: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("event_glimpses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Glimpse delete error:", error);
      return NextResponse.json({ error: "Failed to delete glimpse" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}