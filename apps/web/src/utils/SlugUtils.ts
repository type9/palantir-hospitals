import _ from "lodash"

import { noteNameToString } from "@/musictheory/notes/notename"
import { FLAT_NOTES, SHARP_NOTES } from "@/musictheory/notes/tables"
import { containsSpecialCharacters } from "./containsSpecialCharacter"

export const SlugNotes = _.uniq([...SHARP_NOTES, ...FLAT_NOTES])

export const NoteSlugVariations = [
	...SlugNotes.map((n) => noteNameToString(n).toLowerCase()),
	...SlugNotes.map((n) => noteNameToString(n).toUpperCase()),
]

export const getVariations = (names: string[]) => {
	const variations: string[] = []
	names
		.filter((name) => !containsSpecialCharacters(name))
		.forEach((name) => {
			variations.push(name.toLowerCase())
			variations.push(name.toUpperCase())
			variations.push(_.capitalize(name))
		})
	return variations
}

export const getSlugNoteVariations = (types?: string[]): string[] => {
	const slugs: string[] = []
	const typeVariations = types ? getVariations(types) : undefined
	NoteSlugVariations.forEach((note) => {
		if (!typeVariations || typeVariations.length === 0) {
			slugs.push(note)
			return
		}
		typeVariations.forEach((type) =>
			slugs.push(`${encodeURIComponent(note)}_${type}`),
		)
	})
	return slugs
}
