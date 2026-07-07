import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("genre_samples")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Public genres fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
    }

    return NextResponse.json({ genres: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}