import { z } from "zod"

export const PatientNoteComponentsSchema = z.object({
	context: z.string(),
	procedures: z.array(z.string()),
	result: z.string(),
})

export type PatientNoteComponents = z.infer<typeof PatientNoteComponentsSchema>
