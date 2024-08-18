import { Note } from "@/musictheory/models/Note"
import { Shape } from "@/musictheory/models/Shape"
import { MAX_NOTES } from "@/musictheory/notes/constants"
import { noteStringToNoteName } from "@/musictheory/notes/notename"

//finds the relative note while maintaining the original note's modifier
export const getRelativeDisplayNote = (note: string, semitones: number) => {
	if (semitones === 0) return note
	const noteName = noteStringToNoteName(note)
	const startingNote = new Note(note)
	const relativeNote =
		startingNote.id + semitones > 0
			? new Note((startingNote.id + semitones) % MAX_NOTES)
			: new Note(MAX_NOTES + (startingNote.id + semitones))

	return relativeNote.getDisplayName({ modifier: noteName.modifier ?? "b" })
}

export const getInvertedRootNote = ({
	rootNote,
	shape,
	inversionIndex,
}: {
	rootNote: string
	shape: Shape
	inversionIndex: number
}) => {
	if (inversionIndex % (shape.elements.length + 1) === 0) return rootNote

	const relativeRootHalfsteps =
		shape.elements[(inversionIndex - 1) % (shape.elements.length + 1)]
	if (!relativeRootHalfsteps) throw new Error("Invalid shape")

	return getRelativeDisplayNote(rootNote, relativeRootHalfsteps)
}

//finds the relative note and shape while maintaining the original note's modifier
export const getInvertedRootAndShape = ({
	rootNote,
	shape,
	inversionIndex,
}: {
	rootNote: string
	shape: Shape
	inversionIndex: number
}): { rootNote: string; shape: Shape } => {
	if (inversionIndex % (shape.elements.length + 1) === 0)
		return { rootNote, shape }

	return {
		rootNote: getInvertedRootNote({ rootNote, shape, inversionIndex }),
		shape: shape.getNthInversion(inversionIndex),
	}
}
