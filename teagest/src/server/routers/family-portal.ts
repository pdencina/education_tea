import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const familyPortalRouter = createTRPCRouter({
  // Get the student(s) linked to this family user
  getMyChildren: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx.session.user as any).id;

    const links = await ctx.prisma.familyLink.findMany({
      where: { userId },
      include: {
        student: {
          include: {
            group: true,
            peis: {
              where: { status: "ACTIVE" },
              include: {
                objectives: { include: { area: true } },
                period: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return links.map((l) => ({
      ...l.student,
      relationship: l.relationship,
    }));
  }),

  // Get daily reports for my child
  getReports: protectedProcedure
    .input(z.object({ studentId: z.string(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;

      // Verify this family has access to this student
      const link = await ctx.prisma.familyLink.findUnique({
        where: { userId_studentId: { userId, studentId: input.studentId } },
      });
      if (!link) return [];

      return ctx.prisma.dailyReport.findMany({
        where: { studentId: input.studentId },
        include: { sentBy: { select: { name: true } } },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),

  // Get messages for my child
  getMessages: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;

      const link = await ctx.prisma.familyLink.findUnique({
        where: { userId_studentId: { userId, studentId: input.studentId } },
      });
      if (!link) return [];

      return ctx.prisma.message.findMany({
        where: { studentId: input.studentId },
        include: { sender: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
        take: 50,
      });
    }),

  // Send message as family
  sendMessage: protectedProcedure
    .input(z.object({ studentId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;

      const link = await ctx.prisma.familyLink.findUnique({
        where: { userId_studentId: { userId, studentId: input.studentId } },
      });
      if (!link) throw new Error("No tienes acceso");

      return ctx.prisma.message.create({
        data: { studentId: input.studentId, senderId: userId, content: input.content },
      });
    }),

  // Get upcoming appointments for my child
  getAppointments: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;

      const link = await ctx.prisma.familyLink.findUnique({
        where: { userId_studentId: { userId, studentId: input.studentId } },
      });
      if (!link) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return ctx.prisma.appointment.findMany({
        where: {
          studentId: input.studentId,
          date: { gte: today },
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
        include: {
          therapist: { select: { name: true, specialty: true } },
          room: { select: { name: true } },
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        take: 10,
      });
    }),
});
