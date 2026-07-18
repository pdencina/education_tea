import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const indicatorsRouter = createTRPCRouter({
  // Occupancy by room (% of available hours used)
  roomOccupancy: protectedProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const now = new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate ? new Date(input.endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const rooms = await ctx.prisma.room.findMany({ where: { tenantId, isActive: true } });

      const results = await Promise.all(rooms.map(async (room) => {
        const appointments = await ctx.prisma.appointment.count({
          where: { roomId: room.id, date: { gte: startDate, lte: endDate }, status: { not: "CANCELLED" } },
        });

        // Assume 10 slots per day, count business days
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * 5 / 7;
        const totalSlots = Math.round(days * 10);
        const occupancy = totalSlots > 0 ? Math.round((appointments / totalSlots) * 100) : 0;

        return { id: room.id, name: room.name, color: room.color, appointments, totalSlots, occupancy: Math.min(occupancy, 100) };
      }));

      return results;
    }),

  // Performance by therapist (sessions completed, no-shows, hours)
  therapistPerformance: protectedProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const now = new Date();
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate ? new Date(input.endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const therapists = await ctx.prisma.user.findMany({
        where: { tenantId, role: { not: "FAMILY" }, isActive: true },
        select: { id: true, name: true, specialty: true },
      });

      const results = await Promise.all(therapists.map(async (t) => {
        const [completed, noShow, total] = await Promise.all([
          ctx.prisma.appointment.count({ where: { therapistId: t.id, date: { gte: startDate, lte: endDate }, status: "COMPLETED" } }),
          ctx.prisma.appointment.count({ where: { therapistId: t.id, date: { gte: startDate, lte: endDate }, status: "NO_SHOW" } }),
          ctx.prisma.appointment.count({ where: { therapistId: t.id, date: { gte: startDate, lte: endDate }, status: { not: "CANCELLED" } } }),
        ]);

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const patients = await ctx.prisma.assignment.count({ where: { userId: t.id } });

        return { id: t.id, name: t.name, specialty: t.specialty, completed, noShow, total, completionRate, patients };
      }));

      return results.filter((r) => r.total > 0).sort((a, b) => b.completed - a.completed);
    }),

  // Absence trends (last 12 weeks)
  absenceTrends: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const weeks: { label: string; total: number; noShow: number; rate: number }[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const [total, noShow] = await Promise.all([
        ctx.prisma.appointment.count({ where: { student: { tenantId }, date: { gte: weekStart, lt: weekEnd }, status: { not: "CANCELLED" } } }),
        ctx.prisma.appointment.count({ where: { student: { tenantId }, date: { gte: weekStart, lt: weekEnd }, status: "NO_SHOW" } }),
      ]);

      weeks.push({
        label: weekStart.toLocaleDateString("es", { day: "numeric", month: "short" }),
        total,
        noShow,
        rate: total > 0 ? Math.round((noShow / total) * 100) : 0,
      });
    }

    return weeks;
  }),

  // Top absentee students
  topAbsentees: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const students = await ctx.prisma.student.findMany({
        where: { tenantId, status: "ACTIVE" },
        select: { id: true, firstName: true, lastName: true, supportLevel: true },
      });

      const results = await Promise.all(students.map(async (s) => {
        const [total, noShow] = await Promise.all([
          ctx.prisma.appointment.count({ where: { studentId: s.id, date: { gte: monthStart }, status: { not: "CANCELLED" } } }),
          ctx.prisma.appointment.count({ where: { studentId: s.id, date: { gte: monthStart }, status: "NO_SHOW" } }),
        ]);
        return { ...s, total, noShow, rate: total > 0 ? Math.round((noShow / total) * 100) : 0 };
      }));

      return results.filter((r) => r.noShow > 0).sort((a, b) => b.rate - a.rate).slice(0, input?.limit || 10);
    }),

  // General KPIs
  kpis: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalAppointments, completedAppointments, totalStudents, totalStaff, totalHours] = await Promise.all([
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: monthStart, lte: monthEnd }, status: { not: "CANCELLED" } } }),
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: monthStart, lte: monthEnd }, status: "COMPLETED" } }),
      ctx.prisma.student.count({ where: { tenantId, status: "ACTIVE" } }),
      ctx.prisma.user.count({ where: { tenantId, role: { not: "FAMILY" }, isActive: true } }),
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: monthStart, lte: monthEnd }, status: "COMPLETED" } }),
    ]);

    const attendanceRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    const avgSessionsPerStudent = totalStudents > 0 ? Math.round(completedAppointments / totalStudents) : 0;
    const avgSessionsPerTherapist = totalStaff > 0 ? Math.round(completedAppointments / totalStaff) : 0;

    return {
      totalAppointments,
      completedAppointments,
      attendanceRate,
      totalStudents,
      totalStaff,
      avgSessionsPerStudent,
      avgSessionsPerTherapist,
      estimatedHours: totalHours, // 1 session = ~1 hour approx
    };
  }),
});
