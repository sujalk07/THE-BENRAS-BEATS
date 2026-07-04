// app/api/admin/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userId, ...eventData } = body;

    if (!(await verifyAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, description, event_date, venue, image_url, capacity, ticket_price, registration_open } = eventData;

    const updatePayload: Record<string, any> = {
      title,
      description,
      event_date,
      venue,
      image_url,
      capacity,
      ticket_price,
    };

    // Only include registration_open if explicitly provided (so partial updates don't accidentally reset it)
    if (typeof registration_open === "boolean") {
      updatePayload.registration_open = registration_open;
    }

    const { data, error } = await supabaseAdmin
      .from("events")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin event update error:", error);
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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

    const { count, error: countError } = await supabaseAdmin
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id);

    if (countError) {
      console.error("Registration count check error:", countError);
      return NextResponse.json({ error: "Failed to check registrations" }, { status: 500 });
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error: `This event has ${count} existing registration(s) and can't be deleted. Close bookings instead if you want to stop new signups.`,
        },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin.from("events").delete().eq("id", id);

    if (error) {
      console.error("Admin event delete error:", error);
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}