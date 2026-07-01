import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { plan, userId } = await request.json();

    if (!plan || !["intro", "regular"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid membership plan." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    let amount = 6000;
    let isIntroOffer = false;

    // Intro Offer Logic
    if (plan === "intro") {
      const { count, error } = await supabaseAdmin
        .from("memberships")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("is_intro_offer", true);

      if (error) {
        console.error(error);

        return NextResponse.json(
          { error: "Failed to check intro memberships." },
          { status: 500 }
        );
      }

      if ((count ?? 0) >= 50) {
        return NextResponse.json(
          {
            soldOut: true,
            error: "Introductory membership has ended.",
          },
          { status: 400 }
        );
      }

      amount = 4999;
      isIntroOffer = true;
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `membership_${Date.now()}`,
    });

    // Save Order in Database
    const { error: insertError } = await supabaseAdmin
      .from("membership_orders")
      .insert({
        user_id: userId,
        razorpay_order_id: order.id,
        plan,
        amount,
        is_intro_offer: isIntroOffer,
        status: "pending",
      });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        { error: "Failed to save order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      isIntroOffer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}