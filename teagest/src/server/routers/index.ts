import { createTRPCRouter } from "../trpc";
import { studentsRouter } from "./students";
import { groupsRouter } from "./groups";

export const appRouter = createTRPCRouter({
  students: studentsRouter,
  groups: groupsRouter,
});

export type AppRouter = typeof appRouter;
