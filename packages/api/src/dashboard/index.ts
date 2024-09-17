import { createTRPCRouter } from "../trpc"
import { caseSearchByPrompt } from "./procedures/caseSearchByPrompt"

export const dashboardRouter = createTRPCRouter({
	caseSearchByPrompt,
})
