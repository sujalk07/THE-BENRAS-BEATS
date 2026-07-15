import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import {
  sendMembershipRejectedEmail,
  sendMembershipCertificateEmail,
} from "@/lib/email";
import { generateCertificatePDF } from "@/lib/certificate";

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

    const requesterEmail = request.email?.toLowerCase();
    if (!requesterEmail) {
  return NextResponse.json(
    { error: "User email not found." },
    { status: 404 }
  );
}

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

   const { error: qrError } = await supabaseAdmin
  .from("qr_based_membership")
  .insert({
    name: request.full_name,
    email: requesterEmail,
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    status: "active",
  });

if (qrError) {
  console.error(qrError);
  return NextResponse.json(
    { error: "Failed to create QR membership." },
    { status: 500 }
  );
}
const { error: membershipError } = await supabaseAdmin
  .from("memberships")
  .insert({
    email: requesterEmail,
    amount: request.amount,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    created_with: "qr",
  });

if (membershipError) {
  console.error(membershipError);

  return NextResponse.json(
    {
      error: "Failed to activate membership.",
    },
    {
      status: 500,
    }
  );
}

    await supabaseAdmin
  .from("profiles")
  .update({
    membership_status: "active",
  })
  .eq("id", request.user_id);

    await supabaseAdmin
      .from("membership_requests")
      .update({
        status: "verified",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (requesterEmail) {

try {
  const durationText = `${startsAt.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  })} to ${expiresAt.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  })}`;

  const certificateBuffer = await generateCertificatePDF(
    request.full_name,
    durationText
  );

  await sendMembershipCertificateEmail(
    requesterEmail,
    request.full_name,
    certificateBuffer
  );
} catch (err) {
  console.error("Certificate email failed:", err);
}
    }

    return NextResponse.json({ success: true, status: "verified" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}