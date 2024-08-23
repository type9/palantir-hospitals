import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

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

export type PatientNoteComponents = z.infer<typeof PatientNoteComponentsSchema>

export const ComponentizePatientNoteResponseJSONSchema = zodToJsonSchema(
	PatientNoteComponentsSchema,
	{ name: "responseRoot" },
)?.definitions?.responseRoot as Record<string, unknown>
