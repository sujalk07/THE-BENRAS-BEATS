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
      .from("membership_waitlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Waitlist fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch waitlist" }, { status: 500 });
    }

    return NextResponse.json({ waitlist: data ?? [] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}