import { z } from "zod"

export const createAnonymousUserSchema = z.object({
	expiresAt: z.date().optional(),
})
