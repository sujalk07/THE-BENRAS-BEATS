// app/api/events/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { registerUserForEvent } from "@/lib/event-registration";
import { sendTicketConfirmationEmail } from "@/lib/email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: Request) {
  try {
    const { eventId, userId } = await request.json();

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing eventId or userId" }, { status: 400 });
    }

    // Check Membership
    const { data: profile, error: profileError } = await supabaseAdmin
  .from("profiles")
  .select("membership_status, full_name")
  .eq("id", userId)
  .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    if (profile.membership_status !== "active") {
      return NextResponse.json(
        { error: "Access Denied. You must have an active membership to register for events." },
        { status: 403 }
      );
    }

    // Check Event
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("capacity, title, event_date, venue, registration_open")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    if (!event.registration_open) {
      return NextResponse.json(
        { error: "Registration for this event is currently closed." },
        { status: 403 }
      );
    }

    // Check Capacity
    const { count, error: countError } = await supabaseAdmin
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (countError) throw countError;

    if ((count ?? 0) >= event.capacity) {
      return NextResponse.json({ error: "This event is completely full!" }, { status: 400 });
    }

    // Check Already Registered
    const { data: existingRegistration } = await supabaseAdmin
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this event!" }, { status: 400 });
    }

    // Create ticket + registration via the RPC (single source of truth — no manual inserts here)
    await registerUserForEvent({
      eventId,
      userId,
      orderId: null,
      paymentId: null,
      amountPaid: 0,
      claimedByMember: true,
    });

    // Fetch the ticket we just created + event details + user's email, then send confirmation
    const { data: newTicket } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: eventDetails } = await supabaseAdmin
      .from("events")
      .select("title, event_date, venue")
      .eq("id", eventId)
      .maybeSingle();

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (newTicket && eventDetails && authUser?.user?.email) {
      await sendTicketConfirmationEmail({
        to: authUser.user.email,
        holderName: profile.full_name ?? "Guest",
        eventTitle: eventDetails.title,
        eventDate: eventDetails.event_date,
        venue: eventDetails.venue,
        isMember: true,
        amountPaid: 0,
        ticketId: newTicket.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully registered for the event!",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}