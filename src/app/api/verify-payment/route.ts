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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

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

    // Get Order Details (read-only — just for ownership check + amount/plan info)
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

    // 🔒 SECURITY: Ensure the order actually belongs to the requesting user.
    if (order.user_id !== userId) {
      return NextResponse.json(
        { error: "This order does not belong to the specified user." },
        { status: 403 }
      );
    }

    // Fast-path duplicate check (the RPC re-checks this under a row lock
    // too, to close the race window — this early return just avoids an
    // unnecessary RPC call on the common "webhook fired twice" case).
    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
      });
    }

    const paidAt = new Date();

    // Fetch the auth user once, reused for the RPC call + certificate/email below
    const { data: authUserResult, error: authUserError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authUserError || !authUserResult?.user?.email) {
      throw new Error("User email not found.");
    }

    const userEmail = authUserResult.user.email.toLowerCase();

    // ==========================================================
    // ALL database writes (membership_orders, razorpay_based_membership,
    // profiles, memberships) happen atomically inside this single RPC call.
    // If any step inside it fails, Postgres rolls back all of them —
    // no partial state is possible.
    // ==========================================================
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
      "process_membership_payment",
      {
        p_order_id: order.id,
        p_razorpay_order_id: razorpay_order_id,
        p_razorpay_payment_id: razorpay_payment_id,
        p_user_id: userId,
        p_email: userEmail,
        p_amount: order.amount,
        p_is_intro_offer: order.is_intro_offer,
        p_paid_at: paidAt.toISOString(),
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    if (rpcResult?.already_paid) {
      // A concurrent request beat us to it after our fast-path check above.
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
      });
    }

    const isRenewal: boolean = rpcResult.is_renewal;
    const membershipStartsAt = new Date(rpcResult.starts_at);
    const membershipExpiresAt = new Date(rpcResult.expires_at);

    // ==========================================================
    // Everything below runs ONLY after the transaction has committed.
    // Certificate generation and email are external side effects and
    // are intentionally NOT part of the atomic transaction. A failure
    // here must never roll back or block the already-active membership.
    // ==========================================================
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      const memberName = profile?.full_name ?? "Valued Member";

      const durationText = `${membershipStartsAt.toLocaleDateString("en-IN", {
        dateStyle: "medium",
      })} to ${membershipExpiresAt.toLocaleDateString("en-IN", {
        dateStyle: "medium",
      })}`;

      const certificateBuffer = await generateCertificatePDF(memberName, durationText);
      await sendMembershipCertificateEmail(userEmail, memberName, certificateBuffer);
    } catch (certErr) {
      console.error("Certificate generation/email failed (membership still activated):", certErr);
    }

    return NextResponse.json({
      success: true,
      message: isRenewal
        ? "Membership renewed successfully!"
        : "Membership activated successfully!",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}