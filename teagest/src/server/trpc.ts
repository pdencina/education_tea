import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";
import { prisma } from "@/lib/db";

type CreateContextOptions = {
  session: Session | null;
};

export const createTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
