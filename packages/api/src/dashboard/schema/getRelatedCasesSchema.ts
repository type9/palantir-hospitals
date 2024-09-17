import { z } from "zod"

export const GetRelatedCasesSchema = z.object({
	prompt: z.string().nonempty(),
	limit: z.number().int().positive(),
})
