import { z } from "zod"

import { GetNextPatientDataSchema } from "./getNextPatientData"

export const TriggerPatientDataParseSchema = z.object({
	limit: z.number().optional().default(1),
	reparseOptions: GetNextPatientDataSchema.optional(),
})

export type TriggerPatientDataParseArgs = z.infer<
	typeof TriggerPatientDataParseSchema
>
