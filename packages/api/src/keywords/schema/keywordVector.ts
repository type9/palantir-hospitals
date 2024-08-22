import { z } from "zod"

export const VectorSearchInputSchema = z.object({
	vector: z.array(z.number()).min(768).max(768), // Ensure the vector is the correct dimension
	topK: z.number().default(10).optional(), // Number of top results to return
})

export type VectorSearchInput = z.infer<typeof VectorSearchInputSchema>
