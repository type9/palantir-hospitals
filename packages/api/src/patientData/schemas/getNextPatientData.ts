import { z } from "zod"

export const GetNextPatientDataSchema = z.object({
	reparseLtDate: z.string().optional(),
})

export type GetNextPatientDataArgs = z.infer<typeof GetNextPatientDataSchema>
