import { createTRPCRouter, protectedProcedure } from "../trpc";

export const devAreasRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.devArea.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
    });
  }),
});
