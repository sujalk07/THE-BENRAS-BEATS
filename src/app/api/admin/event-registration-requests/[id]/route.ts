import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";
import { registerUserForEvent } from "@/lib/event-registration";
import { sendTicketConfirmationEmail, sendEventRegistrationRejectedEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, action, note } = await req.json();

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const { data: request, error: fetchError } = await supabaseAdmin
      .from("event_registration_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !request) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json({ error: `Request already ${request.status}.` }, { status: 409 });
    }

    const allAuthUsers = await getAllAuthUsers();
    const requesterEmail = allAuthUsers.find((u) => u.id === request.user_id)?.email;

    if (action === "reject") {
      await supabaseAdmin
        .from("event_registration_requests")
        .update({
          status: "rejected",
          admin_note: note ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (requesterEmail) {
        await sendEventRegistrationRejectedEmail(requesterEmail, request.full_name, note);
      }

      return NextResponse.json({ success: true, status: "rejected" });
    }

    // action === "verify" — create the actual ticket via the same RPC used by Razorpay flow
    let ticketId: string;
    try {
      const result = await registerUserForEvent({
        eventId: request.event_id,
        userId: request.user_id,
        orderId: null,
        paymentId: `manual_${request.id}`,
        amountPaid: request.amount,
        claimedByMember: false,
      });
      ticketId = result.ticketId;
    } catch (regErr: any) {
      console.error("Error registering user for event on verify:", regErr);
      return NextResponse.json(
        { error: regErr.message || "Failed to register user for the event." },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("event_registration_requests")
      .update({
        status: "verified",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        ticket_id: ticketId,
      })
      .eq("id", id);

    // Send the ticket confirmation email — same one used by the Razorpay flow
    if (requesterEmail) {
      const { data: event } = await supabaseAdmin
        .from("events")
        .select("title, event_date, venue")
        .eq("id", request.event_id)
        .maybeSingle();

      if (event) {
        await sendTicketConfirmationEmail({
          to: requesterEmail,
          holderName: request.full_name,
          eventTitle: event.title,
          eventDate: event.event_date,
          venue: event.venue,
          isMember: false,
          amountPaid: request.amount,
          ticketId,
        });
      }
    }

    return NextResponse.json({ success: true, status: "verified" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}