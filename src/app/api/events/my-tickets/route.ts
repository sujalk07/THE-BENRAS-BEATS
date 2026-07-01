// app/api/events/my-tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_registrations")
      .select(
        `
        id,
        registered_at,
        events (
          title,
          event_date,
          venue
        )
      `
      )
      .eq("user_id", userId)
      .order("registered_at", { ascending: false });

    if (error) {
      console.error("Ticket fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }

    const tickets = (data ?? []).map((row: any) => ({
      id: row.id,
      event_title: row.events?.title ?? "Untitled Event",
      event_date: row.events?.event_date ?? null,
      venue: row.events?.venue ?? "TBA",
      status: "confirmed",
    }));

    return NextResponse.json({ tickets });
  } catch (err: any) {
    console.error("My-tickets error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}