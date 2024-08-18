import { z } from "zod"

import { SerializableCompanionStateSchema } from "./companionState"

export const SetRemoteCompanionStateInputSchema = z.object({
	remoteId: z.string().optional(),
	companionState: SerializableCompanionStateSchema,
})

export const GetRemoteCompanionStateInputSchema = z.object({
	remoteId: z.string().optional(),
})
