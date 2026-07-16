import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const staffRouter = createTRPCRouter({
  // List all staff (non-FAMILY users)
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    return ctx.prisma.user.findMany({
      where: {
        tenantId,
        role: { not: "FAMILY" },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialty: true,
        license: true,
        phone: true,
        avatar: true,
        createdAt: true,
        _count: { select: { assignments: true, sessions: true } },
        assignments: {
          select: {
            student: {
              select: { id: true, firstName: true, lastName: true, supportLevel: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }),

  // Get staff member detail
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.user.findFirst({
        where: { id: input.id, tenantId, role: { not: "FAMILY" } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          specialty: true,
          license: true,
          phone: true,
          avatar: true,
          createdAt: true,
          assignments: {
            select: {
              id: true,
              assignedAt: true,
              student: {
                select: { id: true, firstName: true, lastName: true, supportLevel: true, group: { select: { name: true } } },
              },
            },
          },
          sessions: {
            select: { id: true, date: true, type: true, student: { select: { firstName: true, lastName: true } } },
            orderBy: { date: "desc" },
            take: 10,
          },
        },
      });
    }),

  // Assign a professional to a student
  assign: protectedProcedure
    .input(z.object({ userId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Verify both belong to tenant
      const user = await ctx.prisma.user.findFirst({ where: { id: input.userId, tenantId } });
      const student = await ctx.prisma.student.findFirst({ where: { id: input.studentId, tenantId } });
      if (!user || !student) throw new Error("Usuario o alumno no encontrado");

      // Check if already assigned
      const existing = await ctx.prisma.assignment.findUnique({
        where: { userId_studentId: { userId: input.userId, studentId: input.studentId } },
      });
      if (existing) throw new Error("Ya está asignado a este alumno");

      return ctx.prisma.assignment.create({
        data: { userId: input.userId, studentId: input.studentId },
      });
    }),

  // Remove assignment
  unassign: protectedProcedure
    .input(z.object({ userId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.assignment.delete({
        where: { userId_studentId: { userId: input.userId, studentId: input.studentId } },
      });
    }),
});
