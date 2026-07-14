import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";
import { sendMembershipVerifiedEmail, sendMembershipRejectedEmail } from "@/lib/email";

const MEMBERSHIP_MONTHS = 6;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      .from("membership_requests")
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
        .from("membership_requests")
        .update({
          status: "rejected",
          admin_note: note ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (requesterEmail) {
        await sendMembershipRejectedEmail(requesterEmail, request.full_name, note);
      }

      return NextResponse.json({ success: true, status: "rejected" });
    }

    // action === "verify"
    const startsAt = new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(expiresAt.getMonth() + MEMBERSHIP_MONTHS);

    const { error: membershipError } = await supabaseAdmin.from("memberships").insert({
      user_id: request.user_id,
      plan_name: "introductory",
      status: "active",
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      amount: request.amount,
      source: "qr_manual_verify",
      membership_request_id: request.id,
    });

    if (membershipError) {
      console.error("Error creating membership on verify:", membershipError);
      return NextResponse.json({ error: "Failed to activate membership." }, { status: 500 });
    }

    await supabaseAdmin
      .from("membership_requests")
      .update({
        status: "verified",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (requesterEmail) {
      await sendMembershipVerifiedEmail(
        requesterEmail,
        request.full_name,
        startsAt.toISOString(),
        expiresAt.toISOString()
      );
    }

    return NextResponse.json({ success: true, status: "verified" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}