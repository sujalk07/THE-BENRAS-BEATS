// app/api/events/register/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { registerUserForEvent } from "@/lib/event-registration";
import { sendTicketConfirmationEmail } from "@/lib/email";
import { getActiveMembership } from "@/lib/membership";

export async function POST(request: Request) {
  try {
    const { eventId, userId } = await request.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Missing eventId or userId" },
        { status: 400 }
      );
    }

    // =====================================================
    // Get user's email from Auth
    // =====================================================
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser.user?.email) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const email = authUser.user.email.toLowerCase();

    // =====================================================
    // Verify active membership using email
    // =====================================================
    const activeMembership = await getActiveMembership(email);

    if (!activeMembership) {
      return NextResponse.json(
        {
          error:
            "Access Denied. You must have an active membership to register for events.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // Get user's profile (for confirmation email)
    // =====================================================
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    // =====================================================
    // Fetch Event
    // =====================================================
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("capacity, title, event_date, venue, registration_open")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    if (!event.registration_open) {
      return NextResponse.json(
        {
          error: "Registration for this event is currently closed.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // Check Capacity
    // =====================================================
    const { count, error: countError } = await supabaseAdmin
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (countError) throw countError;

    if ((count ?? 0) >= event.capacity) {
      return NextResponse.json(
        { error: "This event is completely full!" },
        { status: 400 }
      );
    }

    // =====================================================
    // Already Registered?
    // =====================================================
    const { data: existingRegistration } = await supabaseAdmin
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: "You are already registered for this event!",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Create Ticket + Registration
    // =====================================================
    await registerUserForEvent({
      eventId,
      userId,
      orderId: null,
      paymentId: null,
      amountPaid: 0,
      claimedByMember: true,
    });

    // =====================================================
    // Fetch Ticket
    // =====================================================
    const { data: newTicket } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // =====================================================
    // Fetch Event Details
    // =====================================================
    const { data: eventDetails } = await supabaseAdmin
      .from("events")
      .select("title, event_date, venue")
      .eq("id", eventId)
      .maybeSingle();

    // =====================================================
    // Send Confirmation Email
    // =====================================================
    if (newTicket && eventDetails) {
      await sendTicketConfirmationEmail({
        to: authUser.user.email,
        holderName: profile?.full_name ?? "Guest",
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