import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const evaluationsRouter = createTRPCRouter({
  // List evaluations for a student
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      return ctx.prisma.evaluation.findMany({
        where: { studentId: input.studentId, tenantId },
        include: {
          evaluator: { select: { name: true, specialty: true } },
        },
        orderBy: { date: "desc" },
      });
    }),

  // Get single evaluation detail
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.evaluation.findFirst({
        where: { id: input.id, tenantId },
        include: {
          student: { select: { firstName: true, lastName: true, birthDate: true } },
          evaluator: { select: { name: true, specialty: true } },
        },
      });
    }),

  // Create evaluation
  create: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      type: z.enum(["ADOS_2", "ADI_R", "SENSORY_PROFILE", "VINELAND", "OTHER"]),
      date: z.string(),
      data: z.any(), // JSON with evaluation-specific structure
      summary: z.string().optional(),
      score: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userId = (ctx.session.user as any).id;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      return ctx.prisma.evaluation.create({
        data: {
          tenantId,
          studentId: input.studentId,
          evaluatorId: userId,
          type: input.type,
          date: new Date(input.date),
          data: input.data || {},
          summary: input.summary,
          score: input.score,
          status: "completed",
        },
      });
    }),

  // Delete evaluation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const evaluation = await ctx.prisma.evaluation.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!evaluation) throw new Error("Evaluación no encontrada");
      return ctx.prisma.evaluation.delete({ where: { id: input.id } });
    }),
});
