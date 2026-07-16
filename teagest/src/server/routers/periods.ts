import { createTRPCRouter, protectedProcedure } from "../trpc";

export const periodsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.period.findMany({
      where: { tenantId },
      orderBy: { startDate: "desc" },
    });
  }),

  getActive: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.period.findFirst({
      where: { tenantId, isActive: true },
    });
  }),
});
