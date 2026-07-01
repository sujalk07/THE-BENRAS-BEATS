import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function POST(request: Request) {
  try {
    const { title, description, event_date, venue, image_url, capacity } = await request.json();

    // Basic Validation
    if (!title || !event_date || !venue || !capacity) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Insert into your events table matching your exact schema structure
    const { data: newEvent, error } = await supabaseAdmin
      .from("events")
      .insert({
        title,
        description,
        event_date: new Date(event_date).toISOString(),
        venue,
        image_url,
        capacity: parseInt(capacity, 10),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, event: newEvent, message: "Event created successfully!" });
  } catch (error: any) {
    console.error("Event creation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}