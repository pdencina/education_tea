import { createTRPCRouter } from "../trpc";
import { studentsRouter } from "./students";
import { groupsRouter } from "./groups";
import { peiRouter } from "./pei";
import { devAreasRouter } from "./dev-areas";
import { periodsRouter } from "./periods";

export const appRouter = createTRPCRouter({
  students: studentsRouter,
  groups: groupsRouter,
  pei: peiRouter,
  devAreas: devAreasRouter,
  periods: periodsRouter,
});

export type AppRouter = typeof appRouter;
