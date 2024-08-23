import { createTRPCRouter } from "../trpc"
import { triggerPatientDataParse } from "./procedures/triggerPatientDataParse"

export const patientDataRouter = createTRPCRouter({
	triggerPatientDataParse,
})
