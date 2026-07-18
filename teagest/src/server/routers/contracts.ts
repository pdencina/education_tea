import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const contractsRouter = createTRPCRouter({
  // List contracts for tenant
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.contract.findMany({
      where: { tenantId },
      include: { student: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Create a new contract
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      studentId: z.string().optional(),
      plan: z.string().optional(),
      modalidad: z.string().optional(),
      precio: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Generate unique slug
      const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

      return ctx.prisma.contract.create({
        data: {
          tenantId,
          slug,
          title: input.title,
          content: input.content,
          studentId: input.studentId,
          plan: input.plan,
          modalidad: input.modalidad,
          precio: input.precio,
        },
      });
    }),

  // Delete contract
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const contract = await ctx.prisma.contract.findFirst({ where: { id: input.id, tenantId } });
      if (!contract) throw new Error("Contrato no encontrado");
      return ctx.prisma.contract.delete({ where: { id: input.id } });
    }),
});
