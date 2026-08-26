import { getActiveMembership } from "@/lib/membership";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 1. Fetch all events (past and upcoming — the UI marks closed ones)
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
      // Get user's email
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (!authError && authUser.user?.email) {
        const membership = await getActiveMembership(
          authUser.user.email.toLowerCase()
        );

        isMember = !!membership;
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

    // 5. Sort: upcoming events first (nearest date first),
    // then closed events after (most recently closed first)
    const now = new Date().getTime();

    const sortedEvents = formattedEvents.sort((a, b) => {
      const aTime = new Date(a.event_date).getTime();
      const bTime = new Date(b.event_date).getTime();
      const aIsUpcoming = aTime >= now;
      const bIsUpcoming = bTime >= now;

      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      if (aIsUpcoming && bIsUpcoming) {
        // both upcoming: nearest first
        return aTime - bTime;
      }

      // both closed: most recently closed first
      return bTime - aTime;
    });

    return NextResponse.json({
      events: sortedEvents,
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