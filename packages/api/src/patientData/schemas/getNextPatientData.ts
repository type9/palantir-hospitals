import { z } from "zod"

export const getNextPatientDataSchema = z.object({
	reparseLtDate: z.string().optional(),
})
