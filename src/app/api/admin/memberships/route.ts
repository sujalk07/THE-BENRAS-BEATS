// app/api/admin/memberships/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: memberships, error } = await supabaseAdmin
      .from("memberships")
      .select("id, user_id, plan_name, status, starts_at, expires_at, amount, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin memberships fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ memberships: [] });
    }

    const userIds = [...new Set(memberships.map((m) => m.user_id))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profilesMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const result = memberships.map((m) => ({
      id: m.id,
      holder_name: profilesMap.get(m.user_id)?.full_name ?? "Unknown",
      plan_name: m.plan_name,
      status: m.status,
      starts_at: m.starts_at,
      expires_at: m.expires_at,
      amount: m.amount,
      created_at: m.created_at,
    }));

    return NextResponse.json({ memberships: result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}