import { cache } from "react"
import { createCaller, createTRPCContext } from "@colorchordsapp/api/trpc"

const createContext = cache(async () => {
	return createTRPCContext()
})

export const api = createCaller(createContext)
