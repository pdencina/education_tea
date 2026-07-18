import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const appointmentsRouter = createTRPCRouter({
  // Get appointments by date range (week view)
  getByWeek: protectedProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.appointment.findMany({
        where: {
          tenantId,
          date: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
          status: { not: "CANCELLED" },
        },
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
          therapist: { select: { id: true, name: true } },
          room: { select: { id: true, name: true, color: true } },
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });
    }),

  // Get appointments for a specific therapist
  getByTherapist: protectedProcedure
    .input(z.object({ therapistId: z.string(), startDate: z.string(), endDate: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.appointment.findMany({
        where: {
          tenantId,
          therapistId: input.therapistId,
          date: { gte: new Date(input.startDate), lte: new Date(input.endDate) },
          status: { not: "CANCELLED" },
        },
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
          room: { select: { id: true, name: true, color: true } },
        },
        orderBy: { startTime: "asc" },
      });
    }),

  // Create appointment
  create: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      therapistId: z.string(),
      roomId: z.string().optional(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      type: z.string().default("INDIVIDUAL"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Check for conflicts (same therapist, same time)
      const conflict = await ctx.prisma.appointment.findFirst({
        where: {
          tenantId,
          therapistId: input.therapistId,
          date: new Date(input.date),
          status: { not: "CANCELLED" },
          OR: [
            { startTime: { lt: input.endTime }, endTime: { gt: input.startTime } },
          ],
        },
      });

      if (conflict) {
        throw new Error("El terapeuta ya tiene una cita en ese horario");
      }

      // Check room conflict if room specified
      if (input.roomId) {
        const roomConflict = await ctx.prisma.appointment.findFirst({
          where: {
            tenantId,
            roomId: input.roomId,
            date: new Date(input.date),
            status: { not: "CANCELLED" },
            OR: [
              { startTime: { lt: input.endTime }, endTime: { gt: input.startTime } },
            ],
          },
        });

        if (roomConflict) {
          throw new Error("La sala ya está ocupada en ese horario");
        }
      }

      return ctx.prisma.appointment.create({
        data: {
          tenantId,
          studentId: input.studentId,
          therapistId: input.therapistId,
          roomId: input.roomId,
          date: new Date(input.date),
          startTime: input.startTime,
          endTime: input.endTime,
          type: input.type,
          notes: input.notes,
        },
        include: {
          student: { select: { firstName: true, lastName: true } },
          therapist: { select: { name: true } },
          room: { select: { name: true, color: true } },
        },
      });
    }),

  // Update status (confirm, complete, cancel, no-show)
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const appointment = await ctx.prisma.appointment.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!appointment) throw new Error("Cita no encontrada");

      return ctx.prisma.appointment.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  // Delete appointment
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const appointment = await ctx.prisma.appointment.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!appointment) throw new Error("Cita no encontrada");

      return ctx.prisma.appointment.delete({ where: { id: input.id } });
    }),

  // Get appointments with family contact for WhatsApp reminders
  getWithContacts: protectedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const targetDate = new Date(input.date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      return ctx.prisma.appointment.findMany({
        where: { tenantId, date: { gte: targetDate, lt: nextDay }, status: { in: ["SCHEDULED", "CONFIRMED"] } },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              familyLinks: { include: { user: { select: { name: true, phone: true, email: true } } } },
            },
          },
          therapist: { select: { name: true } },
          room: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      });
    }),

  // Stats for dashboard
  todayStats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, completed, cancelled, noShow] = await Promise.all([
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: today, lt: tomorrow }, status: { not: "CANCELLED" } } }),
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: today, lt: tomorrow }, status: "COMPLETED" } }),
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: today, lt: tomorrow }, status: "CANCELLED" } }),
      ctx.prisma.appointment.count({ where: { tenantId, date: { gte: today, lt: tomorrow }, status: "NO_SHOW" } }),
    ]);

    return { total, completed, cancelled, noShow, pending: total - completed };
  }),

  // === ROOMS ===
  listRooms: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.room.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  createRoom: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string().optional(), capacity: z.number().default(1) }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.room.create({
        data: { tenantId, name: input.name, color: input.color || "#14b8a6", capacity: input.capacity },
      });
    }),

  deleteRoom: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.room.delete({ where: { id: input.id } });
    }),
});
