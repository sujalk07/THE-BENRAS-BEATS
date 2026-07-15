import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Confirm the requester is themselves an active member before revealing the list
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

if (!authUser.user?.email) {
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

const email = authUser.user.email.toLowerCase();

const { data: requesterMembership } = await supabaseAdmin
  .from("memberships")
  .select("status, expires_at")
  .ilike("email", email)
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

    const isExpired = requesterMembership?.expires_at
      ? new Date(requesterMembership.expires_at) < new Date()
      : true;

    if (!requesterMembership || requesterMembership.status !== "active" || isExpired) {
      return NextResponse.json({ error: "Members only" }, { status: 403 });
    }

    // Fetch featured/esteemed members (public showcase within this gated page)
    const { data: featured } = await supabaseAdmin
      .from("featured_members")
      .select("*")
      .order("display_order", { ascending: true });

    // Fetch all active memberships, oldest first, for serial numbering
    const { data: allMemberships, error } = await supabaseAdmin
  .from("memberships")
  .select("id, email, created_at, expires_at, status")
  .eq("status", "active")
  .order("created_at", { ascending: true });


    if (error) {
      console.error("Members list fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }

    // Filter out expired ones (status column may be stale)
    const activeMemberships = (allMemberships ?? []).filter((m) =>
      m.expires_at ? new Date(m.expires_at) >= new Date() : true
    );

    const memberEmails = activeMemberships
  .map((m) => m.email?.toLowerCase())
  .filter((email): email is string => !!email);

const { data: profiles } = await supabaseAdmin
  .from("profiles")
  .select("email, full_name")
  .in("email", memberEmails);

const profilesMap = new Map(
  (profiles ?? [])
    .filter((p) => p.email)
    .map((p) => [p.email!.toLowerCase(), p.full_name])
);

    const members = activeMemberships.map((m, index) => ({
  serial: index + 1,
  name:
  profilesMap.get(m.email.toLowerCase()) ??
  `Member #${index + 1}`,
  membership_id: m.id.slice(0, 8).toUpperCase(),
}));

    return NextResponse.json({
      featured: featured ?? [],
      members,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}