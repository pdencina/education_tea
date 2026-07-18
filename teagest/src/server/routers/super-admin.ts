import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { isSuperAdmin } from "@/lib/super-admin";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

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

  // Create a new center (tenant + admin user)
  createCenter: superAdminProcedure
    .input(z.object({
      centerName: z.string().min(2),
      adminName: z.string().min(2),
      adminEmail: z.string().email(),
      adminPassword: z.string().min(6),
      plan: z.enum(["basic", "center", "network"]).default("basic"),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check email doesn't exist
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.adminEmail } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Ese email ya está registrado" });

      const passwordHash = await bcrypt.hash(input.adminPassword, 12);

      const result = await ctx.prisma.$transaction(async (tx) => {
        // Create tenant
        const tenant = await tx.tenant.create({
          data: { name: input.centerName, plan: input.plan, phone: input.phone },
        });

        // Create default dev areas
        const defaultAreas = [
          { name: "Comunicación", icon: "🗣️", order: 1 },
          { name: "Socialización", icon: "🤝", order: 2 },
          { name: "Autonomía", icon: "🧑‍🦯", order: 3 },
          { name: "Académico", icon: "📚", order: 4 },
          { name: "Sensorial", icon: "🎯", order: 5 },
          { name: "Conducta", icon: "🧠", order: 6 },
          { name: "Motricidad", icon: "🏃", order: 7 },
        ];
        for (const area of defaultAreas) {
          await tx.devArea.create({ data: { ...area, tenantId: tenant.id } });
        }

        // Create admin user
        const user = await tx.user.create({
          data: {
            tenantId: tenant.id,
            email: input.adminEmail,
            passwordHash,
            name: input.adminName,
            role: "ADMIN",
          },
        });

        return { tenant, user };
      });

      return { tenantId: result.tenant.id, tenantName: result.tenant.name, adminEmail: result.user.email };
    }),

  // Get impersonation token (returns user info to sign in as)
  getImpersonateInfo: superAdminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { tenant: true },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuario no encontrado" });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantName: user.tenant.name,
      };
    }),
});
