import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/alumnos/:path*",
    "/pei/:path*",
    "/sesiones/:path*",
    "/comunicacion/:path*",
    "/agenda-visual/:path*",
    "/equipo/:path*",
    "/reportes/:path*",
    "/configuracion/:path*",
  ],
};
