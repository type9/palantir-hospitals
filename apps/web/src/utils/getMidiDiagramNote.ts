
import { DiagramNote } from "@/models/Diagrams"
import { Note } from "@/musictheory/models/Note"
import { MAX_NOTES } from "@/musictheory/notes/constants"

type MidiPartDiagramNote = {
	midiId: DiagramNote["midiId"]
	playableMidiId: DiagramNote["playableMidiId"]
	octave: DiagramNote["octave"]
}

export const getMidiDiagramNote = (
	notes: Note[],
	startingOctave: number,
): MidiPartDiagramNote[] => {
	const playableNotes: MidiPartDiagramNote[] = []
	let octave = startingOctave
	let lastNote: Note | null = null
	notes.forEach((n) => {
		if (lastNote && lastNote.id >= n.id) {
			octave += 1
		}
		playableNotes.push({
			midiId: octave * MAX_NOTES + n.id,
			octave,
			playableMidiId: n.toMidiString(octave),
		})
		lastNote = n
	})
	return playableNotes
}
