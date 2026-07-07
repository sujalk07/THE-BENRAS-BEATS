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
      .from("featured_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Featured members fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }

    return NextResponse.json({ members: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, profession, photo_url, details, display_order } = body;

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("featured_members")
      .insert({
        name,
        profession: profession ?? "",
        photo_url: photo_url ?? null,
        details: details ?? "",
        display_order: display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Featured member create error:", error);
      return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }

    return NextResponse.json({ success: true, member: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}