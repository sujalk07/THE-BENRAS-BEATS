// app/api/admin/memberships/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { data: memberships, error } = await supabaseAdmin
      .from("memberships")
      .select(`
        id,
        email,
        amount,
        status,
        starts_at,
        expires_at,
        created_at,
        created_with
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Failed to fetch memberships." },
        { status: 500 }
      );
    }

    if (!memberships?.length) {
      return NextResponse.json({
        memberships: [],
      });
    }

    const emails = memberships
      .map((m) => m.email.toLowerCase())
      .filter(Boolean);

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .in("email", emails);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [
        p.email.toLowerCase(),
        p.full_name,
      ])
    );

    const result = memberships.map((m) => ({
      id: m.id,
      holder_name:
        profileMap.get(m.email.toLowerCase()) ?? "Unknown",
      holder_email: m.email,
      status: m.status,
      starts_at: m.starts_at,
      expires_at: m.expires_at,
      amount: m.amount,
      created_at: m.created_at,
      created_with: m.created_with,
    }));

    return NextResponse.json({
      memberships: result,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}