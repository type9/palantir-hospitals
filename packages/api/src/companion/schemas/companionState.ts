// src/schemas/companionState.ts
import { z } from "zod"
import { SerializableSaveTraySchema } from "./saveTray"
import { SerializableCompanionConfigurationSchema } from "./companionConfiguration"

// Define CompanionStateSchema
export const CompanionStateSchema = z.object({
	saveTray: SerializableSaveTraySchema,
	configuration: SerializableCompanionConfigurationSchema,
})

// Define SerializableCompanionStateSchema where properties are optional
export const SerializableCompanionStateSchema = CompanionStateSchema.partial()

// Create types
export type CompanionState = z.infer<typeof CompanionStateSchema>
export type SerializableCompanionState = z.infer<
	typeof SerializableCompanionStateSchema
>
