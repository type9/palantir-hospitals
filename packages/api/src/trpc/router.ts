import { patientDataRouter } from "../patientData"
import { createTRPCRouter } from "./context"

export const appRouter = createTRPCRouter({
	patientDataRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
