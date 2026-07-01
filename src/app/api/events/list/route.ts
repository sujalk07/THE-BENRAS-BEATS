import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 1. Fetch all events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (eventsError) throw eventsError;

    // 2. Count registrations
    const { data: counts, error: countsError } = await supabaseAdmin
      .from("event_registrations")
      .select("event_id");

    if (countsError) throw countsError;

    const registrationMap: Record<string, number> = {};

    counts?.forEach((reg) => {
      registrationMap[reg.event_id] =
        (registrationMap[reg.event_id] || 0) + 1;
    });

    // 3. Fetch user registrations
    let userRegistrations: string[] = [];
    let isMember = false;

    if (userId) {
      const { data: userRegs } = await supabaseAdmin
        .from("event_registrations")
        .select("event_id")
        .eq("user_id", userId);

      if (userRegs) {
        userRegistrations = userRegs.map((r) => r.event_id);
      }

      // Fetch membership status
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("membership_status")
        .eq("id", userId)
        .single();

      if (profile?.membership_status === "active") {
        isMember = true;
      }
    }

    // 4. Format response
    const formattedEvents = events.map((event) => {
      const currentAttendees = registrationMap[event.id] || 0;

      return {
        ...event,
        slotsLeft: Math.max(0, event.capacity - currentAttendees),
        isSoldOut: currentAttendees >= event.capacity,
        isUserRegistered: userRegistrations.includes(event.id),
        isMember,
      };
    });

    return NextResponse.json({
      events: formattedEvents,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}