import { supabaseAdmin } from "@/lib/supabase-admin";

/** Single source of truth for "is this email an active member right now." */
export async function getActiveMembership(email: string) {
  const { data } = await supabaseAdmin
    .from("memberships")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const isExpired =
    data.expires_at ? new Date(data.expires_at) < new Date() : true;

  return isExpired ? null : data;
}