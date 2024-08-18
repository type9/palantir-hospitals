import { clerkRouter } from "../users"
import { createTRPCRouter } from "./context"

export const webhookRouter = createTRPCRouter({
	clerk: clerkRouter,
})

export type WebhookRouter = typeof webhookRouter
