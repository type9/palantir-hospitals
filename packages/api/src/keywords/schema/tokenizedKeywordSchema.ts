import { KeywordCategorySchema } from "@colorchordsapp/db/zod"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const KeywordTokenizationSchema = z.object({
	semanticName: z
		.string()
		.describe(
			"A tag of semantic name that describes the entity or action of the keyword. Should use a minimum number of tokens in lowercase seperate by a space to represent the keyword. Use category field to describe this semantic and contextual value further. Use measure field to describe intensity, observation, or similar of this specific instance of the keyword further. Examples: 'fever', 'age', 'heart attack', 'gender', 'position adjustment''",
		),
	category: KeywordCategorySchema.describe(
		"A category from the preset enum type",
	),
	measure: z
		.object({
			category: KeywordCategorySchema.describe(
				"A measure category from the preset keyword category enum type",
			),
			value: z
				.string()
				.describe(
					"The value of the measure. Can be a number or adjective.",
				),
			unit: z.string().optional().describe("The unit of measure"),
		})
		.optional()
		.describe(
			"A measure word that describes the semantic keyword. Can be qualitative or quantitative. Examples: 'intense', '135 degrees', '15mL', 'lacking'",
		),
	contextSentence: z
		.string()
		.describe(
			"A portion or full component of the sentence that gives the informs the meaning of the keyword in the context of the patient case",
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
