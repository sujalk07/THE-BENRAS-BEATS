import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";
import { sendMembershipCertificateEmail } from "@/lib/email";
import { generateCertificatePDF } from "@/lib/certificate";

const MEMBERSHIP_MONTHS = 6;
const DEFAULT_AMOUNT = 4999;

export async function POST(req: NextRequest) {
  try {
    const { userId, name, email, amount, startDate } = await req.json();

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const startsAt = startDate ? new Date(startDate) : new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(expiresAt.getMonth() + MEMBERSHIP_MONTHS);

    // If this email already belongs to a registered user, link the membership
    // to their account so it shows up on their dashboard automatically.
    const allAuthUsers = await getAllAuthUsers();
    const matchedUser = allAuthUsers.find(
  (u) => u.email?.toLowerCase() === normalizedEmail
);

const { data: existingMembership } = await supabaseAdmin
  .from("memberships")
  .select("id")
  .eq("email", normalizedEmail)
  .eq("status", "active")
  .maybeSingle();

if (existingMembership) {
  return NextResponse.json(
    {
      error: "This email already has an active membership.",
    },
    {
      status: 409,
    }
  );
}

    // Store in admin_created_membership (source table)
const { error: adminError } = await supabaseAdmin
  .from("admin_created_membership")
  .insert({
    name,
    email: normalizedEmail,
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  });

if (adminError) {
  console.error(adminError);

  return NextResponse.json(
    { error: "Failed to create admin membership." },
    { status: 500 }
  );
}

// Store in memberships (main table)
const { error: membershipError } = await supabaseAdmin
  .from("memberships")
  .insert({
    email: normalizedEmail,
    amount: amount ?? DEFAULT_AMOUNT,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    created_with: "admin",
  });

if (membershipError) {
  console.error(membershipError);

  return NextResponse.json(
    { error: "Failed to activate membership." },
    { status: 500 }
  );
}

if (matchedUser) {
  await supabaseAdmin
    .from("profiles")
    .update({
      membership_status: "active",
    })
    .eq("id", matchedUser.id);
}

    try {
  const durationText = `${startsAt.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  })} to ${expiresAt.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  })}`;

  const certificateBuffer = await generateCertificatePDF(
    name,
    durationText
  );

 await sendMembershipCertificateEmail(
  normalizedEmail,
  name,
  certificateBuffer
);
} catch (err) {
  console.error("Certificate email failed:", err);
}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}