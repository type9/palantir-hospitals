import { SamplerOptions } from "tone"

const BASE_URL = "/samples"
const SALAMANDER_SAMPLES = "/salamander"

export type SampleDefinition = {
	urls: SamplerOptions["urls"]
	baseUrl: SamplerOptions["baseUrl"]
}
export type GetSampleFunction = (velocity: number) => SampleDefinition

export type SampleType = "salamander"
export type SampleDefinitions = Record<SampleType, GetSampleFunction>

// Note has to be in format <note>sharp. Octaves between 1-8. Velocity between 1-16.
const getSalamanderSample = (
	note: string,
	octave: number,
	velocity: number,
) => {
	if (octave < 0 || octave > 8)
		throw new Error(`Sampler: Salamander octave '${octave}' out of range`)
	if (velocity < 1 || velocity > 16)
		throw new Error(
			`Sampler: Salamander velocity '${velocity}' out of range`,
		)
	return `${note}${octave}v${velocity}.mp3`
}

export const salamanderSamples: GetSampleFunction = (velocity) => ({
	urls: {
		C1: getSalamanderSample("C", 1, velocity),
		C2: getSalamanderSample("C", 2, velocity),
		C3: getSalamanderSample("C", 3, velocity),
		C4: getSalamanderSample("C", 4, velocity),
		C5: getSalamanderSample("C", 5, velocity),
		C6: getSalamanderSample("C", 6, velocity),
		C7: getSalamanderSample("C", 7, velocity),
		C8: getSalamanderSample("C", 8, velocity),

		"D#1": getSalamanderSample("Dsharp", 1, velocity),
		"D#2": getSalamanderSample("Dsharp", 2, velocity),
		"D#3": getSalamanderSample("Dsharp", 3, velocity),
		"D#4": getSalamanderSample("Dsharp", 4, velocity),
		"D#5": getSalamanderSample("Dsharp", 5, velocity),
		"D#6": getSalamanderSample("Dsharp", 6, velocity),
		"D#7": getSalamanderSample("Dsharp", 7, velocity),

		"F#1": getSalamanderSample("Fsharp", 1, velocity),
		"F#2": getSalamanderSample("Fsharp", 2, velocity),
		"F#3": getSalamanderSample("Fsharp", 3, velocity),
		"F#4": getSalamanderSample("Fsharp", 4, velocity),
		"F#5": getSalamanderSample("Fsharp", 5, velocity),
		"F#6": getSalamanderSample("Fsharp", 6, velocity),
		"F#7": getSalamanderSample("Fsharp", 7, velocity),

		A0: getSalamanderSample("A", 0, velocity),
		A1: getSalamanderSample("A", 1, velocity),
		A2: getSalamanderSample("A", 2, velocity),
		A3: getSalamanderSample("A", 3, velocity),
		A4: getSalamanderSample("A", 4, velocity),
		A5: getSalamanderSample("A", 5, velocity),
		A6: getSalamanderSample("A", 6, velocity),
		A7: getSalamanderSample("A", 7, velocity),
	},
	baseUrl: `${BASE_URL}${SALAMANDER_SAMPLES}/`,
})

export const SAMPLE_DEFINITIONS_MAP: SampleDefinitions = {
	salamander: salamanderSamples,
}
