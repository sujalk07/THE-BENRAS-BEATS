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

    // Verify Razorpay Signature
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

    // Fetch pending order
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

    // Update order
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
      console.error(updateError);

      return NextResponse.json(
        { error: "Failed to update order." },
        { status: 500 }
      );
    }

    await registerUserForEvent({
      eventId,
      userId,
      orderId: order.id,
      paymentId: razorpay_payment_id,
      amountPaid: order.amount,
      claimedByMember: false,
    });

    // Fetch the ticket we just created + event details + user info, then send confirmation
    const { data: newTicket } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const [{ data: eventDetails }, { data: profile }, { data: authUser }] = await Promise.all([
      supabaseAdmin.from("events").select("title, event_date, venue").eq("id", eventId).maybeSingle(),
      supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      supabaseAdmin.auth.admin.getUserById(userId),
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