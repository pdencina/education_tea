import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const remindersRouter = createTRPCRouter({
  // Get reminder configurations
  getConfigs: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.reminderConfig.findMany({ where: { tenantId }, orderBy: { type: "asc" } });
  }),

  // Upsert a config
  upsertConfig: protectedProcedure
    .input(z.object({
      type: z.enum(["APPOINTMENT_24H", "APPOINTMENT_1H", "PAYMENT_DUE", "PAYMENT_OVERDUE", "WELCOME", "CUSTOM"]),
      channel: z.enum(["WHATSAPP", "EMAIL", "BOTH"]),
      isActive: z.boolean(),
      template: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.reminderConfig.upsert({
        where: { tenantId_type: { tenantId, type: input.type } },
        update: { channel: input.channel, isActive: input.isActive, template: input.template },
        create: { tenantId, type: input.type, channel: input.channel, isActive: input.isActive, template: input.template },
      });
    }),

  // Get recent logs
  getLogs: protectedProcedure
    .input(z.object({ limit: z.number().default(30) }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      return ctx.prisma.reminderLog.findMany({
        where: { tenantId },
        orderBy: { sentAt: "desc" },
        take: input?.limit || 30,
      });
    }),

  // Stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalSent, totalFailed, whatsappSent, emailSent] = await Promise.all([
      ctx.prisma.reminderLog.count({ where: { tenantId, status: "sent", sentAt: { gte: monthStart } } }),
      ctx.prisma.reminderLog.count({ where: { tenantId, status: "failed", sentAt: { gte: monthStart } } }),
      ctx.prisma.reminderLog.count({ where: { tenantId, channel: "whatsapp", status: "sent", sentAt: { gte: monthStart } } }),
      ctx.prisma.reminderLog.count({ where: { tenantId, channel: "email", status: "sent", sentAt: { gte: monthStart } } }),
    ]);

    return { totalSent, totalFailed, whatsappSent, emailSent };
  }),

  // Manual send (for testing)
  sendTest: protectedProcedure
    .input(z.object({
      channel: z.enum(["whatsapp", "email"]),
      recipient: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // In production, this would call WhatsApp Business API or email service
      // For now, log it
      return ctx.prisma.reminderLog.create({
        data: {
          tenantId,
          type: "CUSTOM",
          channel: input.channel,
          recipient: input.recipient,
          message: input.message,
          status: "sent", // Simulated
        },
      });
    }),
});
