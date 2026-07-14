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

    const { data: requests, error } = await supabaseAdmin
      .from("membership_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin membership-requests fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
    }

    if (!requests || requests.length === 0) {
      return NextResponse.json({ requests: [] });
    }

    const allAuthUsers = await getAllAuthUsers();
    const emailMap = new Map(allAuthUsers.map((u) => [u.id, u.email]));

    const result = await Promise.all(
      requests.map(async (r) => {
        const { data: signedUrlData } = await supabaseAdmin.storage
          .from("payment-screenshots")
          .createSignedUrl(r.screenshot_path, 60 * 60); // 1 hour

        return {
          id: r.id,
          userId: r.user_id,
          fullName: r.full_name,
          email: emailMap.get(r.user_id) ?? "—",
          amount: r.amount,
          status: r.status,
          screenshotUrl: signedUrlData?.signedUrl ?? null,
          adminNote: r.admin_note,
          createdAt: r.created_at,
          reviewedAt: r.reviewed_at,
        };
      })
    );

    return NextResponse.json({ requests: result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}