// src/app/api/razorpay-webhook/route.ts
//
// SETUP REQUIRED:
// 1. Razorpay Dashboard -> Settings -> Webhooks -> Add New Webhook
//    URL: https://thebenarasbeats.com/api/razorpay-webhook
//    Active events: payment.captured (required), payment.failed (optional but recommended)
// 2. Razorpay will generate a Webhook Secret when you save it — copy it.
// 3. Add to your env vars (Vercel + local):
//    RAZORPAY_WEBHOOK_SECRET=whsec_...   (this is DIFFERENT from RAZORPAY_KEY_SECRET)
//
// This route is a SAFETY NET. Your existing /api/verify-payment (called from the
// frontend after checkout) still runs normally for the happy path. This webhook
// catches the cases where that frontend call never happens (tab closed, network
// drop, JS error, etc.) but Razorpay still captured the money.
//
// Safe to run alongside verify-payment because process_membership_payment is
// idempotent — whichever of the two (webhook or frontend call) arrives first
// does the work; the second one is a no-op via the "already_paid" check.

import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  // Razorpay requires the RAW body (unparsed) to validate the signature.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  // Timing-safe compare
  const signaturesMatch =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!signaturesMatch) {
    console.error("Razorpay webhook: signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  // We only care about successful captures for membership activation.
  // (payment.failed is worth logging so stuck "pending" rows are explainable,
  // but requires no table changes.)
  if (event === "payment.failed") {
    const razorpayOrderId = payload.payload?.payment?.entity?.order_id;
    console.warn("Razorpay webhook: payment.failed for order", razorpayOrderId);
    return NextResponse.json({ received: true });
  }

  if (event !== "payment.captured") {
    // Ignore all other event types (refunds, disputes, etc. — not handled here yet)
    return NextResponse.json({ received: true });
  }

  const paymentEntity = payload.payload?.payment?.entity;
  const razorpayOrderId: string | undefined = paymentEntity?.order_id;
  const razorpayPaymentId: string | undefined = paymentEntity?.id;

  if (!razorpayOrderId || !razorpayPaymentId) {
    console.error("Razorpay webhook: missing order_id/payment_id in payload");
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  // Look up which order this belongs to — could be a membership order or an
  // event/ticket order. Check membership_orders first since that's the gap
  // we're closing here.
  const { data: membershipOrder } = await supabaseAdmin
    .from("membership_orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (membershipOrder) {
    if (membershipOrder.status === "paid") {
      // Already processed (frontend's verify-payment beat the webhook here).
      return NextResponse.json({ received: true, already_paid: true });
    }

    const { data: authUserResult, error: authUserError } =
      await supabaseAdmin.auth.admin.getUserById(membershipOrder.user_id);

    if (authUserError || !authUserResult?.user?.email) {
      console.error(
        "Razorpay webhook: could not resolve user email for order",
        membershipOrder.id
      );
      // Return 200 anyway — retrying won't fix a missing user record,
      // and we don't want Razorpay to keep retrying forever on a dead end.
      // This case needs manual follow-up (log/alert instead, if you have one).
      return NextResponse.json({ received: true, error: "user email missing" });
    }

    const userEmail = authUserResult.user.email.toLowerCase();
    const paidAt = new Date();

    const { error: rpcError } = await supabaseAdmin.rpc(
      "process_membership_payment",
      {
        p_order_id: membershipOrder.id,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_user_id: membershipOrder.user_id,
        p_email: userEmail,
        p_amount: membershipOrder.amount,
        p_is_intro_offer: membershipOrder.is_intro_offer,
        p_paid_at: paidAt.toISOString(),
      }
    );

    if (rpcError) {
      console.error("Razorpay webhook: RPC failed for order", membershipOrder.id, rpcError);
      // Return 500 so Razorpay retries the webhook (it retries on non-2xx).
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }

    console.log("Razorpay webhook: reconciled membership order", membershipOrder.id);
    return NextResponse.json({ received: true, reconciled: true });
  }

  // Not a membership order — could be an event/ticket order (event_orders table).
  // Add the equivalent lookup + reconciliation here if ticket payments have the
  // same "frontend never called back" risk. Flagging as TODO rather than guessing
  // at your event_orders reconciliation logic without seeing it confirmed working.
  console.log(
    "Razorpay webhook: order_id not found in membership_orders, ignoring:",
    razorpayOrderId
  );

  return NextResponse.json({ received: true });
}