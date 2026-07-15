import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const { data: membership } = await supabaseAdmin
      .from("memberships")
      .select("id, status, plan_name, starts_at, expires_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (membership && membership.status === "active") {
      const expired = membership.expires_at ? new Date(membership.expires_at) < new Date() : false;
      if (!expired) {
        return NextResponse.json({
          status: "active",
          membershipId: membership.id,
          plan: membership.plan_name,
          startsAt: membership.starts_at,
          expiresAt: membership.expires_at,
        });
      }
    }

    const { data: request } = await supabaseAdmin
      .from("membership_requests")
      .select("id, status, created_at, admin_note")
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

    return NextResponse.json({ status: "none" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}