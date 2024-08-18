import { z } from "zod"

export const LiveNoteStateSchema = z.object({
	isOn: z.boolean(),
	timeOn: z.number(),
	timeOff: z.number().optional(),
	attack: z.number().optional(),
	release: z.number().optional(),
})

// Define LiveNoteStateRecordSchema as a map of number to LiveNoteStateSchema
export const LiveNoteStateRecordSchema = z.record(
	z.number(),
	LiveNoteStateSchema,
)

export const SyntheticMidiNoteMessageEventSchema = z.object({
	note: z.object({
		number: z.number(),
		attack: z.number().optional(),
		release: z.number().optional(),
	}),
})

export const MidiInputEntrySchema = LiveNoteStateSchema.extend({
	indexTime: z.number(),
	midiId: z.number(),
})

export const MidiInputLogSchema = z.array(MidiInputEntrySchema)

export type LiveNoteState = z.infer<typeof LiveNoteStateSchema>
export type LiveNoteStateRecord = z.infer<typeof LiveNoteStateRecordSchema>
export type SyntheticMidiNoteMessageEvent = z.infer<
	typeof SyntheticMidiNoteMessageEventSchema
>
export type MidiInputLog = z.infer<typeof MidiInputLogSchema>
