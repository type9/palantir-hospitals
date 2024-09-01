import { z } from "zod"

export const GetNextPatientDataSchema = z.object({
	limit: z.number().default(1).optional(),
	reparseLtDate: z.string().optional(),
})

export type GetNextPatientDataArgs = z.infer<typeof GetNextPatientDataSchema>
