import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    const trimmedName =
      typeof name === "string" ? name.trim() : null;

    if (!trimmedMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        { error: "Message is too long (max 500 characters)." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("feedback").insert({
      name: trimmedName || null,
      message: trimmedMessage,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback!",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}