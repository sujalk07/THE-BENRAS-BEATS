import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch the membership first so we know if it's tied to a real account
    const { data: membership, error: fetchError } = await supabaseAdmin
      .from("memberships")
      .select("id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("memberships")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Membership delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete membership" }, { status: 500 });
    }

    // If this membership belonged to a real registered user, reset their profile status
    if (membership.user_id) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ membership_status: "inactive" })
        .eq("id", membership.user_id);

      if (profileError) {
        console.error("Profile status reset error (membership already deleted):", profileError);
        // Don't fail the request over this — membership deletion already succeeded
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}