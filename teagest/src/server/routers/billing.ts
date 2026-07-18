import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const billingRouter = createTRPCRouter({
  // List invoices
  list: protectedProcedure
    .input(z.object({
      status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "PARTIAL"]).optional(),
      studentId: z.string().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const where: any = { tenantId };
      if (input?.status) where.status = input.status;
      if (input?.studentId) where.studentId = input.studentId;

      return ctx.prisma.invoice.findMany({
        where,
        include: {
          student: { select: { firstName: true, lastName: true } },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 50,
      });
    }),

  // Stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalPending, totalPaid, totalOverdue, monthRevenue] = await Promise.all([
      ctx.prisma.invoice.aggregate({ where: { tenantId, status: "PENDING" }, _sum: { total: true } }),
      ctx.prisma.invoice.aggregate({ where: { tenantId, status: "PAID" }, _sum: { total: true } }),
      ctx.prisma.invoice.aggregate({ where: { tenantId, status: "OVERDUE" }, _sum: { total: true } }),
      ctx.prisma.invoice.aggregate({
        where: { tenantId, status: "PAID", paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { total: true },
      }),
    ]);

    const pendingCount = await ctx.prisma.invoice.count({ where: { tenantId, status: "PENDING" } });
    const overdueCount = await ctx.prisma.invoice.count({ where: { tenantId, status: "OVERDUE" } });

    return {
      totalPending: totalPending._sum.total || 0,
      totalPaid: totalPaid._sum.total || 0,
      totalOverdue: totalOverdue._sum.total || 0,
      monthRevenue: monthRevenue._sum.total || 0,
      pendingCount,
      overdueCount,
    };
  }),

  // Create invoice
  create: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      description: z.string().min(1),
      amount: z.number().min(0),
      discount: z.number().min(0).default(0),
      dueDate: z.string(),
      convenio: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Generate invoice number
      const count = await ctx.prisma.invoice.count({ where: { tenantId } });
      const number = `BOL-${String(count + 1).padStart(5, "0")}`;

      const total = input.amount - input.discount;

      return ctx.prisma.invoice.create({
        data: {
          tenantId,
          studentId: input.studentId,
          number,
          description: input.description,
          amount: input.amount,
          discount: input.discount,
          total,
          dueDate: new Date(input.dueDate),
          convenio: input.convenio,
          notes: input.notes,
        },
      });
    }),

  // Register payment
  registerPayment: protectedProcedure
    .input(z.object({
      invoiceId: z.string(),
      amount: z.number().min(0),
      method: z.enum(["CASH", "TRANSFER", "DEBIT_CARD", "CREDIT_CARD", "FONASA", "ISAPRE", "INSURANCE", "OTHER"]),
      reference: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const invoice = await ctx.prisma.invoice.findFirst({
        where: { id: input.invoiceId, tenantId },
        include: { payments: true },
      });
      if (!invoice) throw new Error("Boleta no encontrada");

      // Create payment
      const payment = await ctx.prisma.payment.create({
        data: {
          tenantId,
          invoiceId: input.invoiceId,
          amount: input.amount,
          method: input.method,
          reference: input.reference,
          notes: input.notes,
        },
      });

      // Calculate total paid
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + input.amount;

      // Update invoice status
      let newStatus: string;
      if (totalPaid >= invoice.total) {
        newStatus = "PAID";
      } else {
        newStatus = "PARTIAL";
      }

      await ctx.prisma.invoice.update({
        where: { id: input.invoiceId },
        data: { status: newStatus as any, paidAt: newStatus === "PAID" ? new Date() : null },
      });

      return payment;
    }),

  // Cancel invoice
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const invoice = await ctx.prisma.invoice.findFirst({ where: { id: input.id, tenantId } });
      if (!invoice) throw new Error("Boleta no encontrada");

      return ctx.prisma.invoice.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
      });
    }),
});
