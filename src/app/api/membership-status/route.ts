// app/api/membership-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use a service-role client here since this is a server-side API route
// reading membership data that should bypass RLS for legitimate lookups.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get the most recent membership row for this user
    const { data, error } = await supabaseAdmin
      .from("memberships")
      .select("id, plan_name, status, starts_at, expires_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Membership fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch membership" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        membership_status: "inactive",
        membership_id: null,
        plan: null,
        start_date: null,
        expiry_date: null,
      });
    }

    // Optional: treat expired memberships as inactive even if status column says "active"
    const isExpired = data.expires_at ? new Date(data.expires_at) < new Date() : false;
    const effectiveStatus = isExpired ? "inactive" : data.status;

    return NextResponse.json({
      membership_status: effectiveStatus,
      membership_id: data.id,
      plan: data.plan_name, // e.g. "intro" or "regular"
      start_date: data.starts_at,
      expiry_date: data.expires_at,
    });
  } catch (err: any) {
    console.error("Membership status error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}