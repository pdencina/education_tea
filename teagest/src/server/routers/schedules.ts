import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const scheduleItemSchema = z.object({
  id: z.string(),
  pictogramId: z.number(),
  pictogramUrl: z.string(),
  label: z.string(),
  order: z.number(),
});

export const schedulesRouter = createTRPCRouter({
  // List schedules for the tenant
  list: protectedProcedure
    .input(z.object({
      studentId: z.string().optional(),
      isTemplate: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const where: any = { tenantId };
      if (input?.studentId) where.studentId = input.studentId;
      if (input?.isTemplate !== undefined) where.isTemplate = input.isTemplate;

      return ctx.prisma.visualSchedule.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      });
    }),

  // Get single schedule
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.visualSchedule.findFirst({
        where: { id: input.id, tenantId },
      });
    }),

  // Create schedule
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      studentId: z.string().optional(),
      groupId: z.string().optional(),
      items: z.array(scheduleItemSchema),
      isTemplate: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userId = (ctx.session.user as any).id;

      return ctx.prisma.visualSchedule.create({
        data: {
          tenantId,
          title: input.title,
          studentId: input.studentId,
          groupId: input.groupId,
          items: input.items as any,
          isTemplate: input.isTemplate,
          createdById: userId,
        },
      });
    }),

  // Update schedule items
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      items: z.array(scheduleItemSchema).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const { id, ...data } = input;

      const schedule = await ctx.prisma.visualSchedule.findFirst({
        where: { id, tenantId },
      });
      if (!schedule) throw new Error("Agenda no encontrada");

      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.items) updateData.items = data.items;

      return ctx.prisma.visualSchedule.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete schedule
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const schedule = await ctx.prisma.visualSchedule.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!schedule) throw new Error("Agenda no encontrada");

      return ctx.prisma.visualSchedule.delete({ where: { id: input.id } });
    }),
});
