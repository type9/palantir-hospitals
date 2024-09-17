import { dashboardRouter } from "../dashboard"
import { patientDataRouter } from "../patientData"
import { createTRPCRouter } from "./context"

export const appRouter = createTRPCRouter({
	patientDataRouter,
	dashboardRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
