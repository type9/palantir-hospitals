import _ from "lodash"

import { Note } from "@/musictheory/models/Note"
import { isValidNote } from "@/musictheory/notes/formatting"

const parseNoteInput = (input: string) => {
	const cleanedInput = _.trim(input.toLowerCase())
	return isValidNote(cleanedInput) ? new Note(cleanedInput) : undefined
}

export default parseNoteInput
