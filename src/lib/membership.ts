import { supabaseAdmin } from "@/lib/supabase-admin";

/** Single source of truth for "is this user an active member right now." */
export async function getActiveMembership(userId: string) {
  const { data } = await supabaseAdmin
    .from("memberships")
    .select("id, status, expires_at, user_id, manual_name, manual_email")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const isExpired = data.expires_at ? new Date(data.expires_at) < new Date() : true;
  return isExpired ? null : data;
}

/**
 * Links any orphaned admin-added membership (no user_id, matching manual_email)
 * to this account. Call once on login.
 */
export async function linkOrphanedMembership(userId: string, email: string) {
  await supabaseAdmin
    .from("memberships")
    .update({ user_id: userId })
    .is("user_id", null)
    .ilike("manual_email", email);
}