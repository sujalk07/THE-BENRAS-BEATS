import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getActiveMembership } from "@/lib/membership";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required." },
        { status: 400 }
      );
    }
    const { data: authUser, error: authError } =
  await supabaseAdmin.auth.admin.getUserById(userId);

if (authError || !authUser.user?.email) {
  return NextResponse.json(
    { error: "User not found." },
    { status: 404 }
  );
}

const email = authUser.user.email.toLowerCase();

    // Latest membership
    const membership = await getActiveMembership(email);

if (membership) {
  return NextResponse.json({
    status: "active",
    membershipId: membership.id,
    startsAt: membership.starts_at,
    expiresAt: membership.expires_at,
    createdWith: membership.created_with,
  });
}

    // Manual QR request (if memberships are disabled)
    const { data: request } = await supabaseAdmin
  .from("membership_requests")
  .select(`
    id,
    status,
    created_at,
    admin_note
  `)
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

    if (request) {
  return NextResponse.json({
    status: request.status,
    requestId: request.id,
    submittedAt: request.created_at,
    adminNote: request.admin_note,
  });
}

    return NextResponse.json({
      status: "none",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}