import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clinicalHistoryRouter = createTRPCRouter({
  // Get full clinical history for a student (timeline)
  getByStudent: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      type: z.enum(["EVOLUTION", "OBSERVATION", "RECOMMENDATION", "INTERCONSULTATION", "INITIAL_ASSESSMENT", "DISCHARGE"]).optional(),
      specialty: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      const where: any = { studentId: input.studentId, tenantId };
      if (input.type) where.type = input.type;
      if (input.specialty) where.specialty = input.specialty;

      return ctx.prisma.clinicalNote.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, role: true, specialty: true } },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
    }),

  // Create a clinical note
  create: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      type: z.enum(["EVOLUTION", "OBSERVATION", "RECOMMENDATION", "INTERCONSULTATION", "INITIAL_ASSESSMENT", "DISCHARGE"]),
      title: z.string().optional(),
      content: z.string().min(1),
      isPrivate: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userId = (ctx.session.user as any).id;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      // Get author's specialty
      const author = await ctx.prisma.user.findUnique({ where: { id: userId } });

      return ctx.prisma.clinicalNote.create({
        data: {
          tenantId,
          studentId: input.studentId,
          authorId: userId,
          type: input.type,
          title: input.title,
          content: input.content,
          specialty: author?.specialty || null,
          isPrivate: input.isPrivate,
        },
        include: {
          author: { select: { name: true, role: true, specialty: true } },
        },
      });
    }),

  // Delete a note (only author can delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;
      const note = await ctx.prisma.clinicalNote.findFirst({
        where: { id: input.id, authorId: userId },
      });
      if (!note) throw new Error("No puedes eliminar esta nota");
      return ctx.prisma.clinicalNote.delete({ where: { id: input.id } });
    }),

  // Get specialties used in notes (for filter)
  getSpecialties: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const notes = await ctx.prisma.clinicalNote.findMany({
        where: { studentId: input.studentId, tenantId, specialty: { not: null } },
        select: { specialty: true },
        distinct: ["specialty"],
      });
      return notes.map((n) => n.specialty).filter(Boolean) as string[];
    }),
});
