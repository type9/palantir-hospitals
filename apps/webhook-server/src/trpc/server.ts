import { cache } from "react"
import {
	createTRPCContext,
	createWebhookCaller,
} from "@colorchordsapp/api/trpc"

const createContext = cache(async () => {
	return createTRPCContext()
})

export const api = createWebhookCaller(createContext)
