import { companionRouter } from "../companion"
import { anonymousUserRouter } from "../users"
import { createTRPCRouter } from "./context"

export const appRouter = createTRPCRouter({
	companion: companionRouter,
	anonymousUserRouter: anonymousUserRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
