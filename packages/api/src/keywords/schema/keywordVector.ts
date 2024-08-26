import { z } from "zod"

export const VECTOR_DIMENSIONS = 1536

export const VectorSearchInputSchema = z.object({
	vector: z.array(z.number()).max(VECTOR_DIMENSIONS), // Ensure the vector is the correct dimension
	topK: z.number().default(10).optional(), // Number of top results to return
})

export type VectorSearchInput = z.infer<typeof VectorSearchInputSchema>
