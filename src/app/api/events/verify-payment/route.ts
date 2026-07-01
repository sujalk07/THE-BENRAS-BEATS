import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { registerUserForEvent } from "@/lib/event-registration";

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