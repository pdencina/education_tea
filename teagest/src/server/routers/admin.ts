import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  // === TENANT ===
  getTenant: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.tenant.findUnique({ where: { id: tenantId } });
  }),

  updateTenant: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.tenant.update({ where: { id: tenantId }, data: input });
    }),

  // === PERIODS ===
  listPeriods: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.period.findMany({
      where: { tenantId },
      orderBy: { startDate: "desc" },
    });
  }),

  createPeriod: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      isActive: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // If setting as active, deactivate others
      if (input.isActive) {
        await ctx.prisma.period.updateMany({
          where: { tenantId, isActive: true },
          data: { isActive: false },
        });
      }

      return ctx.prisma.period.create({
        data: {
          tenantId,
          name: input.name,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          isActive: input.isActive,
        },
      });
    }),

  togglePeriodActive: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      if (input.isActive) {
        await ctx.prisma.period.updateMany({
          where: { tenantId, isActive: true },
          data: { isActive: false },
        });
      }

      return ctx.prisma.period.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
    }),

  deletePeriod: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.period.delete({ where: { id: input.id } });
    }),

  // === GROUPS ===
  listGroups: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.group.findMany({
      where: { tenantId },
      include: { _count: { select: { students: true } } },
      orderBy: { name: "asc" },
    });
  }),

  createGroup: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      capacity: z.number().min(1).default(8),
      level: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.group.create({
        data: { tenantId, name: input.name, capacity: input.capacity, level: input.level },
      });
    }),

  updateGroup: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      capacity: z.number().min(1).optional(),
      level: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.group.update({ where: { id }, data });
    }),

  deleteGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.group.delete({ where: { id: input.id } });
    }),

  // === DEV AREAS ===
  listDevAreas: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.devArea.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
    });
  }),

  createDevArea: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      icon: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const count = await ctx.prisma.devArea.count({ where: { tenantId } });
      return ctx.prisma.devArea.create({
        data: { tenantId, name: input.name, icon: input.icon, description: input.description, order: count + 1 },
      });
    }),

  updateDevArea: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      icon: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.devArea.update({ where: { id }, data });
    }),

  deleteDevArea: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.devArea.delete({ where: { id: input.id } });
    }),
});
