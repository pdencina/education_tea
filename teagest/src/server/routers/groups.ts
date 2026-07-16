import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groupsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    return ctx.prisma.group.findMany({
      where: { tenantId },
      include: { _count: { select: { students: true } } },
      orderBy: { name: "asc" },
    });
  }),
});
