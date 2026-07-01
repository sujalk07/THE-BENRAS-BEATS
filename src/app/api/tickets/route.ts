// app/api/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select(
        `
        id,
        amount_paid,
        claimed_by_member,
        created_at,
        events (
          id,
          title,
          event_date,
          venue,
          image_url
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Tickets fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }

    const tickets = (data ?? []).map((row: any) => ({
      id: row.id,
      event_id: row.events?.id ?? null,
      event_title: row.events?.title ?? "Untitled Event",
      event_date: row.events?.event_date ?? null,
      venue: row.events?.venue ?? "TBA",
      image_url: row.events?.image_url ?? null,
      is_member: row.claimed_by_member,
      amount_paid: row.amount_paid,
      created_at: row.created_at,
    }));

    return NextResponse.json({ tickets });
  } catch (err: any) {
    console.error("Tickets list error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}