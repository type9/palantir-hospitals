import { createTRPCRouter } from "../trpc"
import { caseSearchByPrompt } from "./procedures/caseSearchByPrompt"
import { getCasesAndKeywordInstancesByIds } from "./procedures/getCasesAndKeywordInstancesByIds"
import { getSimilarIllnessMetrics } from "./procedures/getSimilarIllnessMetrics"
import { getSymptomMetrics } from "./procedures/getSymptomMetrics"
import { getSymptomsByIllness } from "./procedures/getSymtomsByIllness"

export const dashboardRouter = createTRPCRouter({
	getSymptomMetrics,
	getSymptomsByIllness,
	getCasesAndKeywordInstancesByIds,
	getSimilarIllnessMetrics,
	caseSearchByPrompt,
})
