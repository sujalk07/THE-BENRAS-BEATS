import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId parameter" }, { status: 400 });
    }

    // 1. Fetch details of the specific event
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // 2. Fetch registration count for this specific event
    const { count: currentAttendees, error: countError } = await supabaseAdmin
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (countError) throw countError;

    // 3. Check if current user is registered
    let isUserRegistered = false;
    if (userId) {
      const { data: registration } = await supabaseAdmin
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (registration) {
        isUserRegistered = true;
      }
    }

    const slotsLeft = Math.max(0, event.capacity - (currentAttendees ?? 0));

    return NextResponse.json({
      event: {
        ...event,
        slotsLeft,
        isSoldOut: (currentAttendees ?? 0) >= event.capacity,
        isUserRegistered,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}