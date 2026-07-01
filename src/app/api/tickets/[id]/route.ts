// app/api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        user_id,
        amount_paid,
        claimed_by_member,
        created_at,
        events (
          title,
          event_date,
          venue
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Ownership check — only the ticket holder can view it
    if (data.user_id !== userId) {
      return NextResponse.json({ error: "Not authorized to view this ticket" }, { status: 403 });
    }

    // Get holder's name from profiles (fallback to email if not set)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    const events = data.events as any;

    return NextResponse.json({
      ticket: {
        id: data.id,
        holder_name: profile?.full_name ?? "Guest",
        event_title: events?.title ?? "Untitled Event",
        event_date: events?.event_date ?? null,
        venue: events?.venue ?? "TBA",
        is_member: data.claimed_by_member,
        amount_paid: data.amount_paid,
        issued_at: data.created_at,
      },
    });
  } catch (err: any) {
    console.error("Ticket detail error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}