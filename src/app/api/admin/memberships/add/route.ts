import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";
import { sendMembershipVerifiedEmail } from "@/lib/email";

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

    const startsAt = startDate ? new Date(startDate) : new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(expiresAt.getMonth() + MEMBERSHIP_MONTHS);

    // If this email already belongs to a registered user, link the membership
    // to their account so it shows up on their dashboard automatically.
    const allAuthUsers = await getAllAuthUsers();
    const matchedUser = allAuthUsers.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    const { error } = await supabaseAdmin.from("memberships").insert({
      user_id: matchedUser?.id ?? null,
      manual_name: matchedUser ? null : name,
      manual_email: matchedUser ? null : email,
      plan_name: "introductory",
      status: "active",
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      amount: amount ?? DEFAULT_AMOUNT,
      source: "admin_added",
    });

    if (error) {
      console.error("Error adding member manually:", error);
      return NextResponse.json({ error: "Failed to add member." }, { status: 500 });
    }

    await sendMembershipVerifiedEmail(email, name, startsAt.toISOString(), expiresAt.toISOString());

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}