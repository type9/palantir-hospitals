import { z } from "zod"

export const handleClerkWebhookInputSchema = z.object({
	body: z.string(),
	svixId: z.string(),
	svixTimestamp: z.string(),
	svixSignature: z.string(),
})
