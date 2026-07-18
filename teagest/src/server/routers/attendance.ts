import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRouter = createTRPCRouter({
  // Get today's appointments for attendance marking
  getToday: protectedProcedure
    .input(z.object({ date: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const targetDate = input?.date ? new Date(input.date) : new Date();
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      return ctx.prisma.appointment.findMany({
        where: {
          tenantId,
          date: { gte: targetDate, lt: nextDay },
        },
        include: {
          student: { select: { id: true, firstName: true, lastName: true, supportLevel: true } },
          therapist: { select: { id: true, name: true, specialty: true } },
          room: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      });
    }),

  // Mark attendance (update appointment status)
  mark: protectedProcedure
    .input(z.object({
      appointmentId: z.string(),
      status: z.enum(["COMPLETED", "NO_SHOW", "CANCELLED", "SCHEDULED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const appointment = await ctx.prisma.appointment.findFirst({
        where: { id: input.appointmentId, tenantId },
      });
      if (!appointment) throw new Error("Cita no encontrada");

      return ctx.prisma.appointment.update({
        where: { id: input.appointmentId },
        data: { status: input.status },
      });
    }),

  // Attendance stats for a date range
  stats: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Default to current month
      const now = new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate ? new Date(input.endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [total, completed, noShow, cancelled] = await Promise.all([
        ctx.prisma.appointment.count({ where: { tenantId, date: { gte: startDate, lte: endDate } } }),
        ctx.prisma.appointment.count({ where: { tenantId, date: { gte: startDate, lte: endDate }, status: "COMPLETED" } }),
        ctx.prisma.appointment.count({ where: { tenantId, date: { gte: startDate, lte: endDate }, status: "NO_SHOW" } }),
        ctx.prisma.appointment.count({ where: { tenantId, date: { gte: startDate, lte: endDate }, status: "CANCELLED" } }),
      ]);

      const attendanceRate = total > 0 ? Math.round((completed / (total - cancelled)) * 100) : 0;

      return { total, completed, noShow, cancelled, attendanceRate };
    }),

  // Attendance by student (for reports)
  byStudent: protectedProcedure
    .input(z.object({ studentId: z.string(), limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.appointment.findMany({
        where: { tenantId, studentId: input.studentId, status: { in: ["COMPLETED", "NO_SHOW", "CANCELLED"] } },
        select: { id: true, date: true, startTime: true, status: true, type: true },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),
});
