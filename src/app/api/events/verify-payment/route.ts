import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { registerUserForEvent } from "@/lib/event-registration";
import { sendTicketConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      eventId,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !eventId
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // ==========================
    // Verify Razorpay Signature
    // ==========================
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // ==========================
    // Fetch pending order (source of truth — never trust body userId/eventId directly)
    // ==========================
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from("event_orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Sanity check: the caller's claimed identity must match the order's owner.
    // Prevents someone from reusing a valid signature with a swapped userId/eventId.
    if (order.user_id !== userId || order.event_id !== eventId) {
      console.error(
        `Order/user mismatch: order ${order.id} belongs to user ${order.user_id}/event ${order.event_id}, ` +
        `but request claimed user ${userId}/event ${eventId}`
      );
      return NextResponse.json(
        { error: "Order does not match the requesting user or event." },
        { status: 403 }
      );
    }

    // Idempotency guard — handles double-fires from Razorpay's handler,
    // double-taps, or retried requests. Without this, a replayed valid
    // signature would re-register the user and re-send the confirmation email.
    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Ticket already booked.",
      });
    }

    // ==========================
    // Register first, then mark paid.
    // If registerUserForEvent throws, the order stays "pending" so a retry
    // can still complete registration — instead of being stuck "paid" with
    // no ticket ever created.
    // ==========================
    await registerUserForEvent({
      eventId: order.event_id,
      userId: order.user_id,
      orderId: order.id,
      paymentId: razorpay_payment_id,
      amountPaid: order.amount,
      claimedByMember: false,
    });

    const { error: updateError } = await supabaseAdmin
      .from("event_orders")
      .update({
        razorpay_payment_id,
        status: "paid",
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      // Registration succeeded but the order status update failed — log loudly.
      // The ticket exists, so this is a data-consistency issue to fix manually,
      // not a reason to fail the request back to the user.
      console.error("Failed to update order status after successful registration:", updateError);
    }

    // ==========================
    // Fetch the ticket we just created + event details + user info, then send confirmation
    // ==========================
    const { data: newTicket } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("user_id", order.user_id)
      .eq("event_id", order.event_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const [{ data: eventDetails }, { data: profile }, { data: authUser }] = await Promise.all([
      supabaseAdmin.from("events").select("title, event_date, venue").eq("id", order.event_id).maybeSingle(),
      supabaseAdmin.from("profiles").select("full_name").eq("id", order.user_id).maybeSingle(),
      supabaseAdmin.auth.admin.getUserById(order.user_id),
    ]);

    if (newTicket && eventDetails && authUser?.user?.email) {
      await sendTicketConfirmationEmail({
        to: authUser.user.email,
        holderName: profile?.full_name ?? "Guest",
        eventTitle: eventDetails.title,
        eventDate: eventDetails.event_date,
        venue: eventDetails.venue,
        isMember: false,
        amountPaid: order.amount,
        ticketId: newTicket.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Ticket booked successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}