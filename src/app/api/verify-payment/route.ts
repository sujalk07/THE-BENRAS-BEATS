import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateCertificatePDF } from "@/lib/certificate";
import { sendMembershipCertificateEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = await request.json();

    // Verify Razorpay Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Get Order Details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("membership_orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Membership order not found." },
        { status: 404 }
      );
    }

    // Prevent duplicate processing
    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
      });
    }

    // Current Time
    const startsAt = new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(expiresAt.getMonth() + 6);

    // Update Membership Order
    const { error: orderUpdateError } = await supabaseAdmin
      .from("membership_orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (orderUpdateError) {
      throw orderUpdateError;
    }

    // Check if membership already exists
    const { data: authUser } =
  await supabaseAdmin.auth.admin.getUserById(userId);

const userEmail = authUser.user?.email?.toLowerCase();

if (!userEmail) {
  throw new Error("User email not found.");
}

const { data: existingMembership } = await supabaseAdmin
  .from("memberships")
  .select("id")
  .eq("email", userEmail)
  .eq("status", "active")
  .maybeSingle();

    if (existingMembership) {
      return NextResponse.json({
        success: true,
        message: "Membership already exists.",
      });
    }

    // 🚨 CONCURRENCY GUARD: Final check before consuming an intro offer slot
    // if (order.is_intro_offer) {
    //   const { count, error: finalCountError } = await supabaseAdmin
    //     .from("memberships")
    //     .select("*", { count: "exact", head: true })
    //     .eq("is_intro_offer", true);

    //   if (finalCountError) throw finalCountError;

    //   if ((count ?? 0) >= 50) {
    //     return NextResponse.json(
    //       { 
    //         error: "We are deeply sorry! The last introductory membership spot was filled while your transaction was processing. Please contact support for an immediate refund." 
    //       },
    //       { status: 400 }
    //     );
    //   }
    // }


    const { error: razorpayMembershipError } = await supabaseAdmin
  .from("razorpay_based_membership")
  .insert({
    email: userEmail,
    razorpay_order_id,
    razorpay_payment_id,
    amount: order.amount,
    is_intro_offer: order.is_intro_offer,
    status: "paid",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    paid_at: new Date().toISOString(),
  });

if (razorpayMembershipError) {
  throw razorpayMembershipError;
}

await supabaseAdmin
  .from("profiles")
  .update({
    membership_status: "active",
  })
  .eq("id", userId);
    // Create Membership
    const { error: membershipError } = await supabaseAdmin
      .from("memberships")
      .insert({
  email: userEmail,
  amount: order.amount,
  status: "active",
  starts_at: startsAt.toISOString(),
  expires_at: expiresAt.toISOString(),
  created_with: "razorpay",
})

    if (membershipError) {
      throw membershipError;
    }

    // Update Profile

    // ==========================
    // Generate & email the membership certificate
    // (Non-blocking failure — membership is already active regardless of email outcome)
    // ==========================
    try {
      const [{ data: profile }, { data: authUser }] = await Promise.all([
        supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
        supabaseAdmin.auth.admin.getUserById(userId),
      ]);

      const memberName = profile?.full_name ?? "Valued Member";
      const userEmail = authUser?.user?.email;

      const durationText = `${startsAt.toLocaleDateString("en-IN", {
        dateStyle: "medium",
      })} to ${expiresAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}`;

      if (userEmail) {
        const certificateBuffer = await generateCertificatePDF(memberName, durationText);
        await sendMembershipCertificateEmail(userEmail, memberName, certificateBuffer);
      }
    } catch (certErr) {
      console.error("Certificate generation/email failed (membership still activated):", certErr);
    }

    return NextResponse.json({
      success: true,
      message: "Membership activated successfully!",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}