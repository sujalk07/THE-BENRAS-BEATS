import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";
import { sendMembershipOpenAnnouncement } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: waitlist, error } = await supabaseAdmin
      .from("membership_waitlist")
      .select("email");

    if (error) {
      console.error("Waitlist fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch waitlist" }, { status: 500 });
    }

    if (!waitlist || waitlist.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "Waitlist is empty." });
    }

    let sent = 0;
    let failed = 0;

    // Send sequentially to avoid hitting Resend rate limits
    for (const entry of waitlist) {
      const result = await sendMembershipOpenAnnouncement(entry.email);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Sent to ${sent} people${failed > 0 ? `, ${failed} failed` : ""}.`,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}