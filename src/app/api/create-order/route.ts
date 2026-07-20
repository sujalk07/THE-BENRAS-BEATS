import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PLAN_CONFIG = {
  intro: { amount: 4999, isIntroOffer: true },
  regular: { amount: 6000, isIntroOffer: false },
} as const;

type PlanId = keyof typeof PLAN_CONFIG;

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { userId, plan } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!plan || !(plan in PLAN_CONFIG)) {
      return NextResponse.json(
        { error: "A valid plan ('intro' or 'regular') is required." },
        { status: 400 }
      );
    }

    const { amount: planAmount, isIntroOffer } = PLAN_CONFIG[plan as PlanId];

    // Get authenticated user's email
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser.user?.email) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const email = authUser.user.email.toLowerCase();

    // Prevent duplicate active memberships
    const { data: existingMembership } = await supabaseAdmin
      .from("memberships")
      .select("id")
      .eq("email", email)
      .eq("status", "active")
      .maybeSingle();

    if (existingMembership) {
      return NextResponse.json(
        { error: "You already have an active membership." },
        { status: 409 }
      );
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: planAmount * 100,
      currency: "INR",
      receipt: `membership_${Date.now()}`,
    });

    // Save pending order
    const { error: insertError } = await supabaseAdmin
      .from("membership_orders")
      .insert({
        user_id: userId,
        razorpay_order_id: order.id,
        plan,
        amount: planAmount,
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
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}