import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportsRouter = createTRPCRouter({
  // Dashboard stats
  dashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const [totalStudents, totalStaff, totalSessions, totalObjectives] = await Promise.all([
      ctx.prisma.student.count({ where: { tenantId, status: "ACTIVE" } }),
      ctx.prisma.user.count({ where: { tenantId, role: { not: "FAMILY" }, isActive: true } }),
      ctx.prisma.session.count({ where: { student: { tenantId } } }),
      ctx.prisma.pEIObjective.count({ where: { pei: { student: { tenantId } } } }),
    ]);

    const achievedObjectives = await ctx.prisma.pEIObjective.count({
      where: {
        pei: { student: { tenantId } },
        currentStatus: { in: ["ACHIEVED_INDEPENDENT", "ACHIEVED_WITH_SUPPORT"] },
      },
    });

    const inProgressObjectives = await ctx.prisma.pEIObjective.count({
      where: {
        pei: { student: { tenantId } },
        currentStatus: "IN_PROGRESS",
      },
    });

    return {
      totalStudents,
      totalStaff,
      totalSessions,
      totalObjectives,
      achievedObjectives,
      inProgressObjectives,
      achievementRate: totalObjectives > 0 ? Math.round((achievedObjectives / totalObjectives) * 100) : 0,
    };
  }),

  // Students by support level
  studentsByLevel: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const [level1, level2, level3] = await Promise.all([
      ctx.prisma.student.count({ where: { tenantId, status: "ACTIVE", supportLevel: "LEVEL_1" } }),
      ctx.prisma.student.count({ where: { tenantId, status: "ACTIVE", supportLevel: "LEVEL_2" } }),
      ctx.prisma.student.count({ where: { tenantId, status: "ACTIVE", supportLevel: "LEVEL_3" } }),
    ]);

    return { level1, level2, level3 };
  }),

  // Objectives by area (for chart)
  objectivesByArea: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const areas = await ctx.prisma.devArea.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        icon: true,
        objectives: {
          where: { pei: { status: "ACTIVE" } },
          select: { currentStatus: true },
        },
      },
    });

    return areas.map((area) => {
      const total = area.objectives.length;
      const achieved = area.objectives.filter(
        (o) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
      ).length;
      const inProgress = area.objectives.filter((o) => o.currentStatus === "IN_PROGRESS").length;

      return {
        name: area.name,
        icon: area.icon,
        total,
        achieved,
        inProgress,
        notStarted: total - achieved - inProgress,
        percentage: total > 0 ? Math.round((achieved / total) * 100) : 0,
      };
    });
  }),

  // Sessions per week (last 8 weeks)
  sessionsPerWeek: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;

    const weeks: { label: string; count: number }[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = await ctx.prisma.session.count({
        where: {
          student: { tenantId },
          date: { gte: weekStart, lt: weekEnd },
        },
      });

      weeks.push({
        label: weekStart.toLocaleDateString("es", { day: "numeric", month: "short" }),
        count,
      });
    }

    return weeks;
  }),

  // Student progress report data (for PDF)
  studentReport: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const student = await ctx.prisma.student.findFirst({
        where: { id: input.studentId, tenantId },
        include: {
          group: true,
          assignments: { include: { user: { select: { name: true, role: true, specialty: true } } } },
        },
      });

      if (!student) return null;

      const pei = await ctx.prisma.pEI.findFirst({
        where: { studentId: input.studentId, status: "ACTIVE" },
        include: {
          period: true,
          objectives: {
            include: {
              area: true,
              progress: {
                orderBy: { date: "desc" },
                take: 3,
                include: { registeredBy: { select: { name: true } } },
              },
            },
            orderBy: [{ area: { order: "asc" } }, { order: "asc" }],
          },
        },
      });

      const recentSessions = await ctx.prisma.session.findMany({
        where: { studentId: input.studentId },
        orderBy: { date: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      });

      const totalObjectives = pei?.objectives.length || 0;
      const achieved = pei?.objectives.filter(
        (o) => o.currentStatus === "ACHIEVED_INDEPENDENT" || o.currentStatus === "ACHIEVED_WITH_SUPPORT"
      ).length || 0;

      return {
        student,
        pei,
        recentSessions,
        stats: {
          totalObjectives,
          achieved,
          inProgress: pei?.objectives.filter((o) => o.currentStatus === "IN_PROGRESS").length || 0,
          notStarted: pei?.objectives.filter((o) => o.currentStatus === "NOT_STARTED").length || 0,
          achievementRate: totalObjectives > 0 ? Math.round((achieved / totalObjectives) * 100) : 0,
        },
      };
    }),
});
