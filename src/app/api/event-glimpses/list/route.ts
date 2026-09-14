import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("event_glimpses")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Public glimpses fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch glimpses" }, { status: 500 });
    }

    return NextResponse.json({ glimpses: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}