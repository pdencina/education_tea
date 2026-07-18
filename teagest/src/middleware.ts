import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agenda/:path*",
    "/asistencia/:path*",
    "/alumnos/:path*",
    "/lista-espera/:path*",
    "/evaluaciones/:path*",
    "/historial-clinico/:path*",
    "/pei/:path*",
    "/sesiones/:path*",
    "/comunicacion/:path*",
    "/facturacion/:path*",
    "/contratos/:path*",
    "/recordatorios/:path*",
    "/agenda-visual/:path*",
    "/equipo/:path*",
    "/reportes/:path*",
    "/indicadores/:path*",
    "/upgrade/:path*",
    "/admin-panel/:path*",
    "/configuracion/:path*",
    "/familia/:path*",
  ],
};
