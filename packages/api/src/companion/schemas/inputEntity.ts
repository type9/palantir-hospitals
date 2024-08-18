import { z } from "zod"

import { MidiInputEntrySchema, MidiInputLogSchema } from "./midiData"

export const InputEntityTypeSchema = z.enum([
	"chord",
	"sequence",
	"note",
	"interval",
])

export const InputEntitySchema = z.object({
	inputIds: z.array(z.number()),
	confidence: z.number().optional(),
	startTime: z.number(),
	endTime: z.number().optional(),
	logSnippet: MidiInputLogSchema,
	meta: z.any().optional(),
})

export const InputEntityWithoutMetaSchema = InputEntitySchema.extend({
	meta: z.undefined(),
})

export type InputEntityType = z.infer<typeof InputEntityTypeSchema>
export type MidiInputEntry = z.infer<typeof MidiInputEntrySchema>
export type InputEntity = z.infer<typeof InputEntitySchema>

export type InputEntityWithoutMeta = z.infer<
	typeof InputEntityWithoutMetaSchema
>
