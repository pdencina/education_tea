// Role-based access control for sidebar navigation
// Defines which modules each role can see

export type UserRole = "ADMIN" | "COORDINATOR" | "TEACHER" | "SPECIALIST" | "FAMILY";

// Modules visible per role
const ROLE_MODULES: Record<UserRole, string[]> = {
  ADMIN: [
    "/dashboard",
    "/agenda",
    "/asistencia",
    "/alumnos",
    "/lista-espera",
    "/evaluaciones",
    "/historial-clinico",
    "/pei",
    "/sesiones",
    "/comunicacion",
    "/facturacion",
    "/contratos",
    "/recordatorios",
    "/agenda-visual",
    "/equipo",
    "/reportes",
    "/indicadores",
    "/configuracion",
  ],
  COORDINATOR: [
    "/dashboard",
    "/agenda",
    "/asistencia",
    "/alumnos",
    "/lista-espera",
    "/evaluaciones",
    "/historial-clinico",
    "/pei",
    "/sesiones",
    "/comunicacion",
    "/agenda-visual",
    "/equipo",
    "/reportes",
    "/indicadores",
    "/configuracion",
  ],
  TEACHER: [
    "/dashboard",
    "/agenda",
    "/asistencia",
    "/alumnos",
    "/historial-clinico",
    "/pei",
    "/sesiones",
    "/comunicacion",
    "/agenda-visual",
  ],
  SPECIALIST: [
    "/dashboard",
    "/agenda",
    "/asistencia",
    "/alumnos",
    "/evaluaciones",
    "/historial-clinico",
    "/sesiones",
    "/comunicacion",
  ],
  FAMILY: [
    "/familia",
    "/familia/mensajes",
    "/familia/citas",
  ],
};

export function getModulesForRole(role: string): string[] {
  return ROLE_MODULES[role as UserRole] || ROLE_MODULES.TEACHER;
}

export function isModuleVisibleForRole(role: string, modulePath: string): boolean {
  const modules = getModulesForRole(role);
  return modules.some((m) => modulePath === m || modulePath.startsWith(m + "/"));
}

export function isFamilyRole(role: string): boolean {
  return role === "FAMILY";
}
