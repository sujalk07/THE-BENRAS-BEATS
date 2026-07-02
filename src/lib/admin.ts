// lib/admin.ts
export const ADMIN_EMAILS = ["sujalbarnwal789@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}