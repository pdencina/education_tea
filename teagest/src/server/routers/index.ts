import { createTRPCRouter } from "../trpc";
import { studentsRouter } from "./students";
import { groupsRouter } from "./groups";
import { peiRouter } from "./pei";
import { devAreasRouter } from "./dev-areas";
import { periodsRouter } from "./periods";
import { sessionsRouter } from "./sessions";
import { communicationRouter } from "./communication";
import { staffRouter } from "./staff";
import { adminRouter } from "./admin";
import { schedulesRouter } from "./schedules";
import { reportsRouter } from "./reports";
import { appointmentsRouter } from "./appointments";

export const appRouter = createTRPCRouter({
  students: studentsRouter,
  groups: groupsRouter,
  pei: peiRouter,
  devAreas: devAreasRouter,
  periods: periodsRouter,
  sessions: sessionsRouter,
  communication: communicationRouter,
  staff: staffRouter,
  admin: adminRouter,
  schedules: schedulesRouter,
  reports: reportsRouter,
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;
