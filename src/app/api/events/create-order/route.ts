import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { eventId, userId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // ==========================
    // Fetch Event
    // ==========================
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("ticket_price,title,registration_open")
      .eq("id", eventId)
      .single();

    console.log("EVENT DATA:");
    console.log(event);

    if (eventError || !event) {
      console.error(eventError);

      return NextResponse.json(
        {
          error: "Event not found.",
          details: eventError,
        },
        {
          status: 404,
        }
      );
    }

    // ==========================
    // Check Registration Open
    // ==========================
    if (!event.registration_open) {
      return NextResponse.json(
        { error: "Registration for this event is currently closed." },
        { status: 403 }
      );
    }

    // ==========================
    // Create Razorpay Order
    // ==========================
    const order = await razorpay.orders.create({
      amount: event.ticket_price * 100,
      currency: "INR",
      receipt: `evt_${eventId.slice(0, 8)}_${Date.now().toString().slice(-6)}`,
    });

    console.log("RAZORPAY ORDER:");
    console.log(order);

    // ==========================
    // Save Pending Order
    // ==========================
    const insertResult = await supabaseAdmin
      .from("event_orders")
      .insert({
        user_id: userId,
        event_id: eventId,
        razorpay_order_id: order.id,
        amount: event.ticket_price,
        status: "pending",
      })
      .select();

    console.log("INSERT RESULT:");
    console.log(insertResult);

    if (insertResult.error) {
      console.error("SUPABASE INSERT ERROR:");
      console.error(insertResult.error);

      return NextResponse.json(
        {
          error: insertResult.error.message,
          details: insertResult.error.details,
          hint: insertResult.error.hint,
          code: insertResult.error.code,
        },
        {
          status: 500,
        }
      );
    }

    console.log("Inserted Order:");
    console.log(insertResult.data);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      eventTitle: event.title,
    });
  } catch (error: any) {
    console.error("CREATE EVENT ORDER ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || "Unknown Error",
        stack: error?.stack,
      },
      {
        status: 500,
      }
    );
  }
}