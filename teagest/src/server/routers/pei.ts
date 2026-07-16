import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const peiRouter = createTRPCRouter({
  // Get PEI by student (most recent active one)
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Verify student belongs to tenant
      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return null;

      return ctx.prisma.pEI.findFirst({
        where: { studentId: input.studentId, status: "ACTIVE" },
        include: {
          period: true,
          objectives: {
            include: {
              area: true,
              progress: {
                orderBy: { date: "desc" },
                take: 5,
                include: { registeredBy: { select: { name: true } } },
              },
            },
            orderBy: [{ area: { order: "asc" } }, { order: "asc" }],
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // List all PEIs for a student
  listByStudent: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      return ctx.prisma.pEI.findMany({
        where: { studentId: input.studentId },
        include: {
          period: true,
          _count: { select: { objectives: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Create a new PEI
  create: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        periodId: z.string(),
        startDate: z.string(),
        reviewDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Verify student belongs to tenant
      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      // Deactivate previous active PEIs for this student
      await ctx.prisma.pEI.updateMany({
        where: { studentId: input.studentId, status: "ACTIVE" },
        data: { status: "CLOSED" },
      });

      return ctx.prisma.pEI.create({
        data: {
          studentId: input.studentId,
          periodId: input.periodId,
          startDate: new Date(input.startDate),
          reviewDate: input.reviewDate ? new Date(input.reviewDate) : null,
          status: "ACTIVE",
          notes: input.notes,
        },
      });
    }),

  // Add objective to PEI
  addObjective: protectedProcedure
    .input(
      z.object({
        peiId: z.string(),
        areaId: z.string(),
        description: z.string().min(1),
        targetLevel: z.enum(["NOT_STARTED", "IN_PROGRESS", "ACHIEVED_WITH_SUPPORT", "ACHIEVED_INDEPENDENT"]),
        targetDate: z.string().optional(),
        responsibleId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the next order number
      const count = await ctx.prisma.pEIObjective.count({
        where: { peiId: input.peiId, areaId: input.areaId },
      });

      return ctx.prisma.pEIObjective.create({
        data: {
          peiId: input.peiId,
          areaId: input.areaId,
          description: input.description,
          targetLevel: input.targetLevel,
          currentStatus: "NOT_STARTED",
          targetDate: input.targetDate ? new Date(input.targetDate) : null,
          responsibleId: input.responsibleId,
          order: count + 1,
        },
      });
    }),

  // Update objective status
  updateObjective: protectedProcedure
    .input(
      z.object({
        objectiveId: z.string(),
        description: z.string().optional(),
        currentStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "ACHIEVED_WITH_SUPPORT", "ACHIEVED_INDEPENDENT"]).optional(),
        targetLevel: z.enum(["NOT_STARTED", "IN_PROGRESS", "ACHIEVED_WITH_SUPPORT", "ACHIEVED_INDEPENDENT"]).optional(),
        targetDate: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { objectiveId, ...data } = input;
      const updateData: any = { ...data };
      if (data.targetDate !== undefined) {
        updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
      }
      return ctx.prisma.pEIObjective.update({
        where: { id: objectiveId },
        data: updateData,
      });
    }),

  // Delete objective
  deleteObjective: protectedProcedure
    .input(z.object({ objectiveId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pEIObjective.delete({
        where: { id: input.objectiveId },
      });
    }),

  // Register progress on an objective
  registerProgress: protectedProcedure
    .input(
      z.object({
        objectiveId: z.string(),
        levelAchieved: z.enum(["NOT_STARTED", "IN_PROGRESS", "ACHIEVED_WITH_SUPPORT", "ACHIEVED_INDEPENDENT"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;

      // Create progress record
      const progress = await ctx.prisma.progress.create({
        data: {
          objectiveId: input.objectiveId,
          levelAchieved: input.levelAchieved,
          notes: input.notes,
          registeredById: userId,
        },
      });

      // Update the objective's current status
      await ctx.prisma.pEIObjective.update({
        where: { id: input.objectiveId },
        data: { currentStatus: input.levelAchieved },
      });

      return progress;
    }),

  // Get progress history for an objective
  getProgress: protectedProcedure
    .input(z.object({ objectiveId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.progress.findMany({
        where: { objectiveId: input.objectiveId },
        include: { registeredBy: { select: { name: true } } },
        orderBy: { date: "desc" },
      });
    }),
});
