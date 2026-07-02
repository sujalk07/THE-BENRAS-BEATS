// lib/admin-api.ts
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminEmail } from "@/lib/admin";

export async function verifyAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) return false;
  return isAdminEmail(data.user.email);
}