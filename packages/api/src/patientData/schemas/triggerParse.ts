import { z } from "zod"

import { GetNextPatientDataSchema } from "./getNextPatientData"

export const TriggerPatientDataParseSchema = z.object({
	reparseOptions: GetNextPatientDataSchema.optional(),
})

export type TriggerPatientDataParseArgs = z.infer<
	typeof TriggerPatientDataParseSchema
>
