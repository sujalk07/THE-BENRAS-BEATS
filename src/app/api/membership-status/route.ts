import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getActiveMembership } from "@/lib/membership";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Get user's email
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser.user?.email) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const email = authUser.user.email.toLowerCase();

    // Check membership
    const membership = await getActiveMembership(email);

    if (!membership) {
      return NextResponse.json({
        membership_status: "inactive",
        membership_id: null,
        start_date: null,
        expiry_date: null,
        created_with: null,
      });
    }

    return NextResponse.json({
      membership_status: "active",
      membership_id: membership.id,
      start_date: membership.starts_at,
      expiry_date: membership.expires_at,
      created_with: membership.created_with,
    });
  } catch (err: any) {
    console.error("Membership status error:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}