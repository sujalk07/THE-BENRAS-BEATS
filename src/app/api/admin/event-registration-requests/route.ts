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

    const { data: requests, error } = await supabaseAdmin
      .from("event_registration_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin event-registration-requests fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
    }

    if (!requests || requests.length === 0) {
      return NextResponse.json({ requests: [] });
    }

    const eventIds = [...new Set(requests.map((r) => r.event_id))];
    const [allAuthUsers, { data: events }] = await Promise.all([
      getAllAuthUsers(),
      supabaseAdmin.from("events").select("id, title, event_date, venue").in("id", eventIds),
    ]);

    const emailMap = new Map(allAuthUsers.map((u) => [u.id, u.email]));
    const eventsMap = new Map((events ?? []).map((e) => [e.id, e]));

    const result = await Promise.all(
      requests.map(async (r) => {
        const { data: signedUrlData } = await supabaseAdmin.storage
          .from("payment-screenshots")
          .createSignedUrl(r.screenshot_path, 60 * 60);

        const event = eventsMap.get(r.event_id);

        return {
          id: r.id,
          userId: r.user_id,
          fullName: r.full_name,
          email: emailMap.get(r.user_id) ?? "—",
          eventId: r.event_id,
          eventTitle: event?.title ?? "Unknown Event",
          eventDate: event?.event_date ?? null,
          venue: event?.venue ?? "—",
          amount: r.amount,
          status: r.status,
          screenshotUrl: signedUrlData?.signedUrl ?? null,
          adminNote: r.admin_note,
          createdAt: r.created_at,
          reviewedAt: r.reviewed_at,
        };
      })
    );

    return NextResponse.json({ requests: result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}