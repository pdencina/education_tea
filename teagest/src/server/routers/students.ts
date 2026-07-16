import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studentsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
        supportLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3"]).optional(),
        status: z.enum(["ACTIVE", "GRADUATED", "TEMPORARY_LEAVE", "WITHDRAWN"]).optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      const where: any = { tenantId };

      if (input?.groupId) where.groupId = input.groupId;
      if (input?.supportLevel) where.supportLevel = input.supportLevel;
      if (input?.status) where.status = input.status;
      if (input?.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: "insensitive" } },
          { lastName: { contains: input.search, mode: "insensitive" } },
          { code: { contains: input.search, mode: "insensitive" } },
        ];
      }

      return ctx.prisma.student.findMany({
        where,
        include: {
          group: true,
          assignments: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        },
        orderBy: { lastName: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      return ctx.prisma.student.findFirst({
        where: { id: input.id, tenantId },
        include: {
          group: true,
          assignments: { include: { user: true } },
          familyLinks: { include: { user: true } },
          peis: { include: { objectives: { include: { area: true } } } },
          documents: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        birthDate: z.string(),
        diagnosis: z.string().optional(),
        supportLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3"]),
        groupId: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;

      // Generate unique code
      const count = await ctx.prisma.student.count({ where: { tenantId } });
      const code = `ALU-${String(count + 1).padStart(4, "0")}`;

      return ctx.prisma.student.create({
        data: {
          tenantId,
          code,
          firstName: input.firstName,
          lastName: input.lastName,
          birthDate: new Date(input.birthDate),
          diagnosis: input.diagnosis,
          supportLevel: input.supportLevel,
          groupId: input.groupId,
          notes: input.notes,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        diagnosis: z.string().optional(),
        supportLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3"]).optional(),
        groupId: z.string().nullable().optional(),
        status: z.enum(["ACTIVE", "GRADUATED", "TEMPORARY_LEAVE", "WITHDRAWN"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const { id, ...data } = input;

      // Verify student belongs to tenant
      const student = await ctx.prisma.student.findFirst({
        where: { id, tenantId },
      });

      if (!student) {
        throw new Error("Alumno no encontrado");
      }

      return ctx.prisma.student.update({
        where: { id },
        data,
      });
    }),
});
