import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  // List users for current tenant
  list: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = (ctx.session.user as any).tenantId;
    const userRole = (ctx.session.user as any).role;

    // Only ADMIN and COORDINATOR can list users
    if (!["ADMIN", "COORDINATOR"].includes(userRole)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Sin permisos" });
    }

    return ctx.prisma.user.findMany({
      where: { tenantId },
      select: { id: true, name: true, email: true, role: true, specialty: true, phone: true, isActive: true, createdAt: true },
      orderBy: { name: "asc" },
    });
  }),

  // Create user
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["ADMIN", "COORDINATOR", "TEACHER", "SPECIALIST", "FAMILY"]),
      specialty: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userRole = (ctx.session.user as any).role;

      if (!["ADMIN", "COORDINATOR"].includes(userRole)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permisos" });
      }

      // Check email unique
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Este email ya está registrado" });

      const passwordHash = await bcrypt.hash(input.password, 12);

      return ctx.prisma.user.create({
        data: {
          tenantId,
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
          specialty: input.specialty,
          phone: input.phone,
        },
      });
    }),

  // Update user (role, active, specialty)
  update: protectedProcedure
    .input(z.object({
      userId: z.string(),
      name: z.string().optional(),
      role: z.enum(["ADMIN", "COORDINATOR", "TEACHER", "SPECIALIST", "FAMILY"]).optional(),
      specialty: z.string().optional(),
      phone: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userRole = (ctx.session.user as any).role;

      if (!["ADMIN", "COORDINATOR"].includes(userRole)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permisos" });
      }

      const user = await ctx.prisma.user.findFirst({ where: { id: input.userId, tenantId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const { userId, ...data } = input;
      return ctx.prisma.user.update({ where: { id: userId }, data });
    }),

  // Reset password
  resetPassword: protectedProcedure
    .input(z.object({ userId: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const userRole = (ctx.session.user as any).role;

      if (!["ADMIN", "COORDINATOR"].includes(userRole)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permisos" });
      }

      const user = await ctx.prisma.user.findFirst({ where: { id: input.userId, tenantId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await ctx.prisma.user.update({ where: { id: input.userId }, data: { passwordHash } });
      return { success: true };
    }),

  // Delete user
  delete: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenantId = (ctx.session.user as any).tenantId;
      const currentUserId = (ctx.session.user as any).id;
      const userRole = (ctx.session.user as any).role;

      if (userRole !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Solo el admin puede eliminar usuarios" });
      }

      if (input.userId === currentUserId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes eliminarte a ti mismo" });
      }

      const user = await ctx.prisma.user.findFirst({ where: { id: input.userId, tenantId } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.user.delete({ where: { id: input.userId } });
    }),
});
