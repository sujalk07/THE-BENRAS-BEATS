import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const eventId = formData.get("eventId") as string | null;
    const fullName = formData.get("fullName") as string | null;
    const amount = formData.get("amount") as string | null;

    if (!file || !userId || !eventId || !fullName || !amount) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WebP images are allowed for the screenshot." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Screenshot must be under 5MB." }, { status: 400 });
    }

    // Block duplicate pending requests for the same event
    const { data: existingPending } = await supabaseAdmin
      .from("event_registration_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .eq("status", "pending")
      .maybeSingle();

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a request pending review for this event." },
        { status: 409 }
      );
    }

    // Block if already registered for this event
    const { data: existingRegistration } = await supabaseAdmin
      .from("event_registrations")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event." },
        { status: 409 }
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `events/${eventId}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Screenshot upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload screenshot." }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_registration_requests")
      .insert({
        event_id: eventId,
        user_id: userId,
        full_name: fullName,
        screenshot_path: fileName,
        amount: Number(amount),
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating event registration request:", error);
      return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
    }

    return NextResponse.json({ success: true, request: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}