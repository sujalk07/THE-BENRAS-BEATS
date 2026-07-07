import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function POST(request: Request) {
  try {
    const {
      userId,
      artistName,
      genre,
      bio,
      socialLink,
      sampleTrackUrl,
      contactNumber,
      email,
      artistType,
    } = await request.json();

    if (!userId || !artistName || !genre || !contactNumber || !email) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("performer_requests")
      .insert({
        user_id: userId,
        artist_name: artistName,
        genre,
        bio,
        social_link: socialLink,
        sample_track_url: sampleTrackUrl,
        contact_number: contactNumber,
        email,
        artist_type: artistType ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Your performer application has been received successfully!",
    });
  } catch (error: any) {
    console.error("Submission failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}