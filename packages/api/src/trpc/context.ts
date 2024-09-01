/**
 * Reference - https://github.com/t3-oss/create-t3-turbo
 */

import { db } from "@colorchordsapp/db"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async () => {
	return {
		db,
	}
}

export type TransactionContext = Parameters<typeof db.$transaction>[0] extends (
	tx: infer T,
) => any
	? T
	: never

export type ServerContext = Awaited<ReturnType<typeof createTRPCContext>>
export type WithServerContext<T> = T & { ctx: ServerContext }
export type WithTransactionContext<T> = T & { tx: TransactionContext }

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error, input, ctx }) => {
		console.log({
			error: error.name,
			input,
		})
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause : null,
			},
		}
	},
})

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure

export const getBaseUrl = () => {
	if (typeof window !== "undefined") return window.location.origin
	if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://localhost:${process.env.PORT ?? 3000}`
}
