// Super Admin configuration
// Only these emails can access /admin-panel

export const SUPER_ADMIN_EMAILS = [
  "admin@centroarcoiris.com", // Temporal - cambiar por tu email real
  // Agrega tu email aquí:
  // "tu@email.com",
];

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email);
}
