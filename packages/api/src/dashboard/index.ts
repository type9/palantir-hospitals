import { createTRPCRouter } from "../trpc"
import { caseSearchByPrompt } from "./procedures/caseSearchByPrompt"
import { getSymptomMetrics } from "./procedures/getSymptomMetrics"

export const dashboardRouter = createTRPCRouter({
	getSymptomMetrics,
	caseSearchByPrompt,
})
