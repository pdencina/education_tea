import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { isSuperAdmin } from "@/lib/super-admin";
import { TRPCError } from "@trpc/server";

// Middleware to check super admin access
const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const email = (ctx.session.user as any)?.email;
  if (!isSuperAdmin(email)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado" });
  }
  return next();
});

export const superAdminRouter = createTRPCRouter({
  // List all tenants
  listTenants: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tenant.findMany({
      include: {
        _count: { select: { users: true, students: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Global stats
  globalStats: superAdminProcedure.query(async ({ ctx }) => {
    const [totalTenants, totalUsers, totalStudents, totalSessions, totalAppointments] = await Promise.all([
      ctx.prisma.tenant.count(),
      ctx.prisma.user.count(),
      ctx.prisma.student.count(),
      ctx.prisma.session.count(),
      ctx.prisma.appointment.count(),
    ]);

    // Tenants by plan
    const basicCount = await ctx.prisma.tenant.count({ where: { plan: "basic" } });
    const centerCount = await ctx.prisma.tenant.count({ where: { plan: "center" } });
    const networkCount = await ctx.prisma.tenant.count({ where: { plan: "network" } });

    return { totalTenants, totalUsers, totalStudents, totalSessions, totalAppointments, basicCount, centerCount, networkCount };
  }),

  // Change tenant plan
  changePlan: superAdminProcedure
    .input(z.object({ tenantId: z.string(), plan: z.enum(["basic", "center", "network"]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tenant.update({
        where: { id: input.tenantId },
        data: { plan: input.plan },
      });
    }),

  // Get tenant details
  getTenant: superAdminProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.tenant.findUnique({
        where: { id: input.tenantId },
        include: {
          users: { select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } },
          _count: { select: { students: true, groups: true } },
        },
      });
    }),

  // Toggle tenant active status (deactivate all users)
  toggleTenant: superAdminProcedure
    .input(z.object({ tenantId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.updateMany({
        where: { tenantId: input.tenantId },
        data: { isActive: input.isActive },
      });
      return { success: true };
    }),
});
