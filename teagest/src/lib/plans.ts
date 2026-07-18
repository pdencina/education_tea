// Plan configuration - defines which modules are available per plan

export type PlanId = "basic" | "center" | "network";

export const PLAN_CONFIG: Record<PlanId, {
  name: string;
  price: string;
  modules: string[];
  limits: {
    patients: number;
    professionals: number;
    rooms: number;
  };
}> = {
  basic: {
    name: "Inicio",
    price: "$49.990",
    modules: [
      "/dashboard",
      "/agenda",
      "/asistencia",
      "/alumnos",
      "/historial-clinico",
      "/pei",
      "/sesiones",
      "/comunicacion",
      "/equipo",
      "/configuracion",
    ],
    limits: {
      patients: 15,
      professionals: 2,
      rooms: 1,
    },
  },
  center: {
    name: "Centro",
    price: "$129.990",
    modules: [
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
      "/recordatorios",
      "/agenda-visual",
      "/equipo",
      "/reportes",
      "/indicadores",
      "/configuracion",
    ],
    limits: {
      patients: 50,
      professionals: 8,
      rooms: 4,
    },
  },
  network: {
    name: "Red",
    price: "$249.990",
    modules: [
      // All modules
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
      "/recordatorios",
      "/agenda-visual",
      "/equipo",
      "/reportes",
      "/indicadores",
      "/configuracion",
    ],
    limits: {
      patients: 99999,
      professionals: 99999,
      rooms: 99999,
    },
  },
};

// Check if a module path is allowed for a plan
export function isModuleAllowed(plan: string, modulePath: string): boolean {
  const planConfig = PLAN_CONFIG[plan as PlanId];
  if (!planConfig) return true; // If plan not recognized, allow all (fallback)

  // Check if the path starts with any allowed module
  return planConfig.modules.some((m) => modulePath === m || modulePath.startsWith(m + "/"));
}

// Get the required plan for a module
export function getRequiredPlan(modulePath: string): PlanId | null {
  // If it's in basic, no upgrade needed
  if (PLAN_CONFIG.basic.modules.some((m) => modulePath === m || modulePath.startsWith(m + "/"))) {
    return null;
  }
  // If it's in center but not basic, center is required
  if (PLAN_CONFIG.center.modules.some((m) => modulePath === m || modulePath.startsWith(m + "/"))) {
    return "center";
  }
  return "network";
}

// Modules that are gated (not in basic plan)
export const GATED_MODULES = [
  "/lista-espera",
  "/evaluaciones",
  "/facturacion",
  "/recordatorios",
  "/agenda-visual",
  "/reportes",
  "/indicadores",
];
