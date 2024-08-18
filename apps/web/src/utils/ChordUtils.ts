import { Interval } from "@/musictheory/models/Interval"
import { Note } from "@/musictheory/models/Note"

export const getNotesFromIntervals = (
	rootNote: Note,
	intervals: Interval[] | undefined,
) => {
	if (!intervals || intervals.length === 0) return [rootNote]

	const notes: Note[] = [rootNote]
	let lastNote = rootNote
	intervals.forEach((i) => {
		const newNote = lastNote.getIntervalNote(i)
		notes.push(newNote)
		lastNote = newNote
	})

	return notes
}

export const getIntervalsFromNotes = (notes: Note[]) => {
	if (notes.length === 0) return []

	const intervals: Interval[] = []
	let lastNote = notes[0]
	if (!lastNote) throw new Error("Invalid note")
	notes.forEach((n, i) => {
		if (i === 0) return
		intervals.push(lastNote!.getInterval(n))
		lastNote = n
	})

	return intervals
}

// //Degrees have to relative to given scale
// export const getIntervalsFromDegrees = (scale: Scale, degrees: Degree[]) =>
// 	getIntervalsFromNotes(getNotesFromDegrees(scale, degrees))
