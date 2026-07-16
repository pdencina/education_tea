import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const communicationRouter = createTRPCRouter({
  // Get messages for a student (conversation thread)
  getMessages: protectedProcedure
    .input(z.object({ studentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      return ctx.prisma.message.findMany({
        where: { studentId: input.studentId },
        include: {
          sender: { select: { id: true, name: true, role: true, avatar: true } },
        },
        orderBy: { createdAt: "asc" },
        take: input.limit,
      });
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      return ctx.prisma.message.create({
        data: {
          studentId: input.studentId,
          senderId: userId,
          content: input.content,
        },
        include: {
          sender: { select: { id: true, name: true, role: true, avatar: true } },
        },
      });
    }),

  // Get students with their last message (for conversation list)
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const students = await ctx.prisma.student.findMany({
      where: { tenantId, status: "ACTIVE" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        code: true,
        group: { select: { name: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            isRead: true,
            sender: { select: { name: true, role: true } },
          },
        },
        _count: { select: { messages: { where: { isRead: false } } } },
      },
      orderBy: { firstName: "asc" },
    });

    return students;
  }),

  // Mark messages as read
  markAsRead: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.message.updateMany({
        where: { studentId: input.studentId, isRead: false },
        data: { isRead: true },
      });
    }),

  // === DAILY REPORTS ===

  // Get daily reports for a student
  getReports: protectedProcedure
    .input(z.object({ studentId: z.string(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) return [];

      return ctx.prisma.dailyReport.findMany({
        where: { studentId: input.studentId },
        include: {
          sentBy: { select: { name: true } },
        },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),

  // Create daily report
  createReport: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      feeding: z.string().optional(),
      rest: z.string().optional(),
      mood: z.string().optional(),
      participation: z.string().optional(),
      highlights: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.session.user as any).id;
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
      });
      if (!student) throw new Error("Alumno no encontrado");

      return ctx.prisma.dailyReport.create({
        data: {
          studentId: input.studentId,
          sentById: userId,
          feeding: input.feeding,
          rest: input.rest,
          mood: input.mood,
          participation: input.participation,
          highlights: input.highlights,
          sentAt: new Date(),
        },
      });
    }),
});
