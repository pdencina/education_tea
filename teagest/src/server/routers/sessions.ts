import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const sessionsRouter = createTRPCRouter({
  // List sessions with filters
  list: protectedProcedure
    .input(
      z.object({
        studentId: z.string().optional(),
        date: z.string().optional(),
        type: z.enum(["INDIVIDUAL", "GROUP", "OCCUPATIONAL_THERAPY", "SPEECH_THERAPY", "PSYCHOLOGY", "OTHER"]).optional(),
        limit: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const where: any = {
        student: { tenantId },
      };

      if (input?.studentId) where.studentId = input.studentId;
      if (input?.type) where.type = input.type;
      if (input?.date) {
        const dateStart = new Date(input.date);
        const dateEnd = new Date(input.date);
        dateEnd.setDate(dateEnd.getDate() + 1);
        where.date = { gte: dateStart, lt: dateEnd };
      }

      return ctx.prisma.session.findMany({
        where,
        include: {
          student: { select: { id: true, firstName: true, lastName: true, code: true } },
          user: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
        take: input?.limit || 20,
      });
    }),

  // Get sessions by student
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.string(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Verify student belongs to tenant
      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      return ctx.prisma.session.findMany({
        where: { studentId: input.studentId },
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),

  // Create a session
  create: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string().optional(),
        type: z.enum(["INDIVIDUAL", "GROUP", "OCCUPATIONAL_THERAPY", "SPEECH_THERAPY", "PSYCHOLOGY", "OTHER"]),
        activities: z.string().optional(),
        behaviors: z.string().optional(),
        mood: z.string().optional(),
        participation: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;
      const tenantId = (ctx.session.user as any).tenantId;

      // Verify student belongs to tenant
      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      return ctx.prisma.session.create({
        data: {
          studentId: input.studentId,
          userId,
          date: new Date(input.date),
          startTime: input.startTime,
          endTime: input.endTime,
          type: input.type,
          activities: input.activities || null,
          behaviors: input.behaviors,
          mood: input.mood,
          participation: input.participation,
          notes: input.notes,
        },
      });
    }),

  // Get session stats for dashboard
  stats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const thisWeek = await ctx.prisma.session.count({
      where: {
        student: { tenantId },
        date: { gte: weekStart, lt: weekEnd },
      },
    });

    const total = await ctx.prisma.session.count({
      where: { student: { tenantId } },
    });

    return { thisWeek, total };
  }),
});
