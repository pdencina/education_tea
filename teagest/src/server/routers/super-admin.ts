import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { isSuperAdmin } from "@/lib/super-admin";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const email = (ctx.session.user as any)?.email;
  if (!isSuperAdmin(email)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado" });
  }
  return next();
});

// Plan prices in CLP for MRR calculation
const PLAN_PRICES: Record<string, number> = { basic: 49990, center: 129990, network: 249990 };

export const superAdminRouter = createTRPCRouter({
  // List all tenants with activity
  listTenants: superAdminProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ];
      }

      return ctx.prisma.tenant.findMany({
        where,
        include: {
          _count: { select: { users: true, students: true } },
          users: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Global stats + MRR
  globalStats: superAdminProcedure.query(async ({ ctx }) => {
    const [totalTenants, totalUsers, totalStudents, totalSessions, totalAppointments] = await Promise.all([
      ctx.prisma.tenant.count(),
      ctx.prisma.user.count(),
      ctx.prisma.student.count(),
      ctx.prisma.session.count(),
      ctx.prisma.appointment.count(),
    ]);

    const basicCount = await ctx.prisma.tenant.count({ where: { plan: "basic" } });
    const centerCount = await ctx.prisma.tenant.count({ where: { plan: "center" } });
    const networkCount = await ctx.prisma.tenant.count({ where: { plan: "network" } });

    // MRR calculation
    const mrr = (basicCount * PLAN_PRICES.basic) + (centerCount * PLAN_PRICES.center) + (networkCount * PLAN_PRICES.network);

    // Growth: tenants created this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = await ctx.prisma.tenant.count({ where: { createdAt: { gte: monthStart } } });

    return { totalTenants, totalUsers, totalStudents, totalSessions, totalAppointments, basicCount, centerCount, networkCount, mrr, newThisMonth };
  }),

  // Activity: sessions/appointments in last 7 days per tenant
  activity: superAdminProcedure.query(async ({ ctx }) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tenants = await ctx.prisma.tenant.findMany({
      select: { id: true, name: true, plan: true, createdAt: true },
    });

    const results = await Promise.all(tenants.map(async (t) => {
      const [sessions, appointments] = await Promise.all([
        ctx.prisma.session.count({ where: { student: { tenantId: t.id }, createdAt: { gte: weekAgo } } }),
        ctx.prisma.appointment.count({ where: { tenantId: t.id, date: { gte: weekAgo } } }),
      ]);
      return { ...t, recentSessions: sessions, recentAppointments: appointments, totalActivity: sessions + appointments };
    }));

    return results.sort((a, b) => b.totalActivity - a.totalActivity);
  }),

  // Churn risk: tenants with NO activity in 7+ days
  churnRisk: superAdminProcedure.query(async ({ ctx }) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tenants = await ctx.prisma.tenant.findMany({
      select: { id: true, name: true, plan: true, email: true, createdAt: true },
    });

    const atRisk = await Promise.all(tenants.map(async (t) => {
      const recentActivity = await ctx.prisma.session.count({
        where: { student: { tenantId: t.id }, createdAt: { gte: weekAgo } },
      });
      const recentAppts = await ctx.prisma.appointment.count({
        where: { tenantId: t.id, date: { gte: weekAgo } },
      });
      if (recentActivity === 0 && recentAppts === 0) return t;
      return null;
    }));

    return atRisk.filter(Boolean);
  }),

  // Usage vs limits per tenant
  usage: superAdminProcedure.query(async ({ ctx }) => {
    const tenants = await ctx.prisma.tenant.findMany({
      select: { id: true, name: true, plan: true },
    });

    const limits: Record<string, { patients: number; professionals: number }> = {
      basic: { patients: 15, professionals: 2 },
      center: { patients: 50, professionals: 8 },
      network: { patients: 99999, professionals: 99999 },
    };

    return Promise.all(tenants.map(async (t) => {
      const [patients, professionals] = await Promise.all([
        ctx.prisma.student.count({ where: { tenantId: t.id, status: "ACTIVE" } }),
        ctx.prisma.user.count({ where: { tenantId: t.id, role: { not: "FAMILY" }, isActive: true } }),
      ]);
      const planLimits = limits[t.plan] || limits.basic;
      return {
        ...t,
        patients,
        professionals,
        patientLimit: planLimits.patients,
        professionalLimit: planLimits.professionals,
        patientUsage: Math.round((patients / planLimits.patients) * 100),
        professionalUsage: Math.round((professionals / planLimits.professionals) * 100),
      };
    }));
  }),

  // Change tenant plan
  changePlan: superAdminProcedure
    .input(z.object({ tenantId: z.string(), plan: z.enum(["basic", "center", "network"]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tenant.update({ where: { id: input.tenantId }, data: { plan: input.plan } });
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

  // Edit tenant
  editTenant: superAdminProcedure
    .input(z.object({ tenantId: z.string(), name: z.string().optional(), email: z.string().optional(), phone: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { tenantId, ...data } = input;
      return ctx.prisma.tenant.update({ where: { id: tenantId }, data });
    }),

  // Delete tenant (and all data)
  deleteTenant: superAdminProcedure
    .input(z.object({ tenantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete in order to respect FK constraints
      await ctx.prisma.user.deleteMany({ where: { tenantId: input.tenantId } });
      await ctx.prisma.student.deleteMany({ where: { tenantId: input.tenantId } });
      await ctx.prisma.group.deleteMany({ where: { tenantId: input.tenantId } });
      await ctx.prisma.period.deleteMany({ where: { tenantId: input.tenantId } });
      await ctx.prisma.devArea.deleteMany({ where: { tenantId: input.tenantId } });
      await ctx.prisma.tenant.delete({ where: { id: input.tenantId } });
      return { success: true };
    }),

  // Toggle tenant active
  toggleTenant: superAdminProcedure
    .input(z.object({ tenantId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.updateMany({ where: { tenantId: input.tenantId }, data: { isActive: input.isActive } });
      return { success: true };
    }),

  // Create center
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
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.adminEmail } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email ya registrado" });

      const passwordHash = await bcrypt.hash(input.adminPassword, 12);

      const result = await ctx.prisma.$transaction(async (tx) => {
        const tenant = await tx.tenant.create({ data: { name: input.centerName, plan: input.plan, phone: input.phone } });

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

        const user = await tx.user.create({
          data: { tenantId: tenant.id, email: input.adminEmail, passwordHash, name: input.adminName, role: "ADMIN" },
        });

        return { tenant, user };
      });

      return { tenantId: result.tenant.id, tenantName: result.tenant.name, adminEmail: result.user.email };
    }),

  // Notes
  getNotes: superAdminProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.tenantNote.findMany({ where: { tenantId: input.tenantId }, orderBy: { createdAt: "desc" } });
    }),

  addNote: superAdminProcedure
    .input(z.object({ tenantId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const email = (ctx.session.user as any)?.email;
      return ctx.prisma.tenantNote.create({ data: { tenantId: input.tenantId, content: input.content, createdBy: email } });
    }),

  // Export tenants as simple data
  exportData: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tenant.findMany({
      select: { id: true, name: true, email: true, phone: true, plan: true, createdAt: true, _count: { select: { users: true, students: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Impersonate info
  getImpersonateInfo: superAdminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { id: input.userId }, include: { tenant: true } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: user.id, email: user.email, name: user.name, role: user.role, tenantName: user.tenant.name };
    }),
});
