// app/api/admin/memberships/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { getAllAuthUsers } from "@/lib/get-all-auth-users";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: memberships, error } = await supabaseAdmin
      .from("memberships")
      .select(
        "id, user_id, plan_name, status, starts_at, expires_at, amount, created_at, source, manual_name, manual_email"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin memberships fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ memberships: [] });
    }

    const userIds = [...new Set(memberships.map((m) => m.user_id).filter(Boolean))];
    const [{ data: profiles }, allAuthUsers] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name").in("id", userIds),
      getAllAuthUsers(),
    ]);

    const profilesMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const emailMap = new Map(allAuthUsers.map((u) => [u.id, u.email]));

    const result = memberships.map((m) => ({
      id: m.id,
      // Fall back to manually-entered name/email when there's no linked account
      holder_name: m.user_id ? profilesMap.get(m.user_id)?.full_name ?? "Unknown" : m.manual_name ?? "Unknown",
      holder_email: m.user_id ? emailMap.get(m.user_id) ?? "—" : m.manual_email ?? "—",
      plan_name: m.plan_name,
      status: m.status,
      starts_at: m.starts_at,
      expires_at: m.expires_at,
      amount: m.amount,
      created_at: m.created_at,
      source: m.source ?? "razorpay",
    }));

    return NextResponse.json({ memberships: result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}