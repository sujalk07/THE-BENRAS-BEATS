import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("membership_waitlist")
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      // Unique constraint violation — already on the list
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "You're already on the list — we'll notify you!",
        });
      }
      console.error("Waitlist insert error:", error);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll email you the moment memberships open.",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}