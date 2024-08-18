import { createTRPCRouter } from "../trpc"
import {
	getCompanionMetaProcedure,
	getCompanionStateProcedure,
	setCompanionDisplayMetaProcedure,
	setCompanionStateProcedure,
} from "./procedures"

export * from "./mappers"
export * from "./procedures"
export * from "./schemas"

export const companionRouter = createTRPCRouter({
	getState: getCompanionStateProcedure,
	setState: setCompanionStateProcedure,
	getMeta: getCompanionMetaProcedure,
	setDisplayMeta: setCompanionDisplayMetaProcedure,
})
