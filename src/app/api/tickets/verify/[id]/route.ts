// app/api/tickets/verify/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: ticket, error } = await supabaseAdmin
      .from("tickets")
      .select("id, event_id, user_id, amount_paid, claimed_by_member")
      .eq("id", id)
      .maybeSingle();

    if (error || !ticket) {
      return NextResponse.json({ valid: false });
    }

    const [{ data: event }, { data: profile }] = await Promise.all([
      supabaseAdmin.from("events").select("title, event_date, venue").eq("id", ticket.event_id).maybeSingle(),
      supabaseAdmin.from("profiles").select("full_name").eq("id", ticket.user_id).maybeSingle(),
    ]);

    return NextResponse.json({
      valid: true,
      event_title: event?.title,
      event_date: event?.event_date,
      venue: event?.venue,
      holder_name: profile?.full_name ?? "Guest",
      is_member: ticket.claimed_by_member,
      amount_paid: ticket.amount_paid,
    });
  } catch (err) {
    console.error("Verify ticket error:", err);
    return NextResponse.json({ valid: false });
  }
}