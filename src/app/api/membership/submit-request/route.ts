import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MEMBERSHIP_AMOUNT = 4999;

export async function POST(req: NextRequest) {
  try {
    const { userId, fullName, screenshotPath } = await req.json();

    if (!userId || !fullName || !screenshotPath) {
      return NextResponse.json(
        { error: "userId, fullName, and screenshotPath are required." },
        { status: 400 }
      );
    }

    // Block duplicate pending requests
    const { data: existingPending } = await supabaseAdmin
      .from("membership_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a membership request pending review." },
        { status: 409 }
      );
    }

    // Block if already an active member
    const { data: activeMembership } = await supabaseAdmin
      .from("memberships")
      .select("id, expires_at")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (activeMembership && (!activeMembership.expires_at || new Date(activeMembership.expires_at) > new Date())) {
      return NextResponse.json(
        { error: "You already have an active membership." },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("membership_requests")
      .insert({
        user_id: userId,
        full_name: fullName,
        screenshot_path: screenshotPath,
        amount: MEMBERSHIP_AMOUNT,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating membership request:", error);
      return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
    }

    return NextResponse.json({ success: true, request: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}