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
      .from("genre_samples")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Genres fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
    }

    return NextResponse.json({ genres: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, genre_name, description, image_url, audio_url, display_order } = body;

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!genre_name) {
      return NextResponse.json({ error: "Genre name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("genre_samples")
      .insert({
        genre_name,
        description: description ?? "",
        image_url: image_url ?? null,
        audio_url: audio_url ?? null,
        display_order: display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Genre create error:", error);
      return NextResponse.json({ error: "Failed to create genre" }, { status: 500 });
    }

    return NextResponse.json({ success: true, genre: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}