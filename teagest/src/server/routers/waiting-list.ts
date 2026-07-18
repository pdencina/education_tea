import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const waitingListRouter = createTRPCRouter({
  // List all entries
  list: protectedProcedure
    .input(z.object({
      status: z.enum(["WAITING", "CONTACTED", "ACCEPTED", "ENROLLED", "DECLINED", "EXPIRED"]).optional(),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const where: any = { tenantId };
      if (input?.status) where.status = input.status;
      if (input?.priority) where.priority = input.priority;

      return ctx.prisma.waitingListEntry.findMany({
        where,
        orderBy: [
          { priority: "asc" }, // HIGH first
          { createdAt: "asc" }, // Then by oldest
        ],
      });
    }),

  // Stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const [total, waiting, contacted, enrolled] = await Promise.all([
      ctx.prisma.waitingListEntry.count({ where: { tenantId } }),
      ctx.prisma.waitingListEntry.count({ where: { tenantId, status: "WAITING" } }),
      ctx.prisma.waitingListEntry.count({ where: { tenantId, status: "CONTACTED" } }),
      ctx.prisma.waitingListEntry.count({ where: { tenantId, status: "ENROLLED" } }),
    ]);

    const highPriority = await ctx.prisma.waitingListEntry.count({
      where: { tenantId, status: "WAITING", priority: "HIGH" },
    });

    return { total, waiting, contacted, enrolled, highPriority };
  }),

  // Create entry
  create: protectedProcedure
    .input(z.object({
      childName: z.string().min(1),
      childBirthDate: z.string().optional(),
      childAge: z.number().optional(),
      diagnosis: z.string().optional(),
      supportLevel: z.string().optional(),
      parentName: z.string().min(1),
      parentEmail: z.string().optional(),
      parentPhone: z.string().min(1),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
      notes: z.string().optional(),
      requestedServices: z.string().optional(),
      referredBy: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.waitingListEntry.create({
        data: {
          tenantId,
          childName: input.childName,
          childBirthDate: input.childBirthDate ? new Date(input.childBirthDate) : null,
          childAge: input.childAge,
          diagnosis: input.diagnosis,
          supportLevel: input.supportLevel,
          parentName: input.parentName,
          parentEmail: input.parentEmail,
          parentPhone: input.parentPhone,
          priority: input.priority,
          notes: input.notes,
          requestedServices: input.requestedServices,
          referredBy: input.referredBy,
        },
      });
    }),

  // Update status
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["WAITING", "CONTACTED", "ACCEPTED", "ENROLLED", "DECLINED", "EXPIRED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const entry = await ctx.prisma.waitingListEntry.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!entry) throw new Error("Entrada no encontrada");

      const data: any = { status: input.status };
      if (input.status === "CONTACTED") data.contactedAt = new Date();
      if (input.status === "ENROLLED") data.enrolledAt = new Date();

      return ctx.prisma.waitingListEntry.update({
        where: { id: input.id },
        data,
      });
    }),

  // Update priority
  updatePriority: protectedProcedure
    .input(z.object({
      id: z.string(),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const entry = await ctx.prisma.waitingListEntry.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!entry) throw new Error("Entrada no encontrada");

      return ctx.prisma.waitingListEntry.update({
        where: { id: input.id },
        data: { priority: input.priority },
      });
    }),

  // Delete entry
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const entry = await ctx.prisma.waitingListEntry.findFirst({
        where: { id: input.id, tenantId },
      });
      if (!entry) throw new Error("Entrada no encontrada");
      return ctx.prisma.waitingListEntry.delete({ where: { id: input.id } });
    }),
});
