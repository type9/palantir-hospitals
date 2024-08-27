import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

import { KeywordTokenizationGroupSchema } from "../../keywords/schema/tokenizedKeywordSchema"

export const PatientNoteComponentsSchema = z.object({
	context: z
		.string()
		.describe(
			"The context and background of the patient's condition before the medical procedures.",
		),
	procedures: z
		.array(z.string())
		.describe(
			" A list of medical procedures that were attempted during the patient's care.",
		),
	result: z
		.string()
		.describe(" The outcomes or results of the procedures attempted. "),
})

export const PatientNoteBatchKeywordTokenizationSchema = z.object({
	context: KeywordTokenizationGroupSchema.describe(
		"Keywords that describe the context and background of the patient's condition before the medical procedures.",
	),
	procedures: z
		.array(KeywordTokenizationGroupSchema)
		.describe(
			"Arrays of keyword arrays that describe the medical procedures that were attempted during the patient's care. Also can include additional diagnosis or discoveries made as a result of the procedure. Each array represents an attempted procedure",
		),
	result: KeywordTokenizationGroupSchema.describe(
		" The outcomes or results of the procedures attempted. ",
	),
})

export type PatientNoteComponents = z.infer<typeof PatientNoteComponentsSchema>

export type PatientNoteBatchKeywordTokenization = z.infer<
	typeof PatientNoteBatchKeywordTokenizationSchema
>

export const ComponentizePatientNoteResponseJSONSchema = zodToJsonSchema(
	PatientNoteComponentsSchema,
	{ name: "responseRoot" },
)?.definitions?.responseRoot as Record<string, unknown>

export const PatientNoteBatchKeywordTokenizationResponseJSONSchema =
	zodToJsonSchema(PatientNoteBatchKeywordTokenizationSchema, {
		name: "responseRoot",
	})?.definitions?.responseRoot as Record<string, unknown>
