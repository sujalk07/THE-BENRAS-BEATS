// app/api/admin/registrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: tickets, error } = await supabaseAdmin
      .from("tickets")
      .select("id, user_id, event_id, amount_paid, claimed_by_member, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin registrations fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ registrations: [] });
    }

    const eventIds = [...new Set(tickets.map((t) => t.event_id))];
    const userIds = [...new Set(tickets.map((t) => t.user_id))];

    const [{ data: events }, { data: profiles }, allAuthUsers] = await Promise.all([
      supabaseAdmin.from("events").select("id, title, event_date, venue").in("id", eventIds),
      supabaseAdmin.from("profiles").select("id, full_name").in("id", userIds),
      getAllAuthUsers(),
    ]);

    const eventsMap = new Map((events ?? []).map((e) => [e.id, e]));
    const profilesMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const emailMap = new Map(allAuthUsers.map((u) => [u.id, u.email]));

    const registrations = tickets.map((t) => {
      const event = eventsMap.get(t.event_id);
      const profile = profilesMap.get(t.user_id);
      return {
        id: t.id,
        holder_name: profile?.full_name ?? "Unknown",
        holder_email: emailMap.get(t.user_id) ?? "—",
        event_title: event?.title ?? "Unknown Event",
        event_date: event?.event_date ?? null,
        venue: event?.venue ?? "—",
        is_member: t.claimed_by_member,
        amount_paid: t.amount_paid,
        created_at: t.created_at,
      };
    });

    return NextResponse.json({ registrations });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}   