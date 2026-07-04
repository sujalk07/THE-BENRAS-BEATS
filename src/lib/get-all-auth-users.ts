// lib/get-all-auth-users.ts
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getAllAuthUsers() {
  const allUsers: { id: string; email?: string }[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });

    if (error) {
      console.error("Error fetching auth users page", page, error);
      break;
    }

    allUsers.push(...data.users);

    if (data.users.length < perPage) {
      // Last page reached
      break;
    }

    page++;
  }

  return allUsers;
}