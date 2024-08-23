import { KeywordCategorySchema } from "@colorchordsapp/db/zod"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const KeywordTokenizationSchema = z.object({
	semanticName: z
		.string()
		.describe(
			"The name of the keyword to identify for similarities later. Can have a minimal number of tokens separated by a space.",
		),
	category: KeywordCategorySchema.describe(
		"A category from the preset enum type",
	),
	contextSentence: z
		.string()
		.describe(
			"A portion or full component of the sentence that gives the keyword meaning in the context of the patient case",
		),
})

export const KeywordTokenizationGroupSchema = z.array(KeywordTokenizationSchema)

export type KeywordTokenizationGroup = z.infer<
	typeof KeywordTokenizationGroupSchema
>

export const KeywordTokenizationGroupResponseSchema = z.object({
	keywords: KeywordTokenizationGroupSchema,
})

export const KeywordTokenizationGroupResponseJSONSchema = zodToJsonSchema(
	KeywordTokenizationGroupResponseSchema,
	{ name: "responseRoot" },
)?.definitions?.responseRoot as Record<string, unknown>
