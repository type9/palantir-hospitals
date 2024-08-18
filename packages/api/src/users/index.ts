import { createTRPCRouter } from "../trpc"
import { createAnonymousUser } from "./procedures"
import { syncClerkUsersProcedure } from "./procedures/syncClerkUsersProcedure"

export * from "./utils"

export const clerkRouter = createTRPCRouter({
	syncClerkUsersProcedure: syncClerkUsersProcedure,
})

export const usersRouter = createTRPCRouter({})

export const anonymousUserRouter = createTRPCRouter({
	createAnonymousUser: createAnonymousUser,
})
