import { z } from "zod"

export const CompanionConfigurationSchema = z.object({
	contextScale: z.object({
		rootNote: z.string(),
		shapeType: z.string(),
	}),
})

export const SerializableCompanionConfigurationSchema =
	CompanionConfigurationSchema.partial().nullable()

export type CompanionConfiguration = z.infer<
	typeof CompanionConfigurationSchema
>
export type SerializableCompanionConfiguration = z.infer<
	typeof SerializableCompanionConfigurationSchema
>
