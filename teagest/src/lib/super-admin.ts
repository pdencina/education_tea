// Super Admin configuration
// Only these emails can access /admin-panel

export const SUPER_ADMIN_EMAILS = [
  "pablo@teagest.cl",
];

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email);
}
