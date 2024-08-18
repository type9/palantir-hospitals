import _ from "lodash"

import { ALL_INTERVALS } from "@/musictheory/models/Interval"
import { ALL_NOTES } from "@/musictheory/notes/tables"
import { CHORDNAME_TO_SHAPE_MAPPING } from "@/musictheory/shapes/chordNameToShape"
import { SCALENAME_TO_SHAPE_MAPPING } from "@/musictheory/shapes/scaleNameToShape"

export type SearchResultItem = {
	label: string
	value?: any
	description?: React.ReactNode
}

export const searchScaleTypes = (
	searchValue: string,
	descriptionEle?: (label: string, name: string) => React.ReactNode,
) => {
	const search = _.trim(searchValue.toLowerCase())
	if (search === "") return []
	const results: SearchResultItem[] = []
	_.keys(SCALENAME_TO_SHAPE_MAPPING).map((name) => {
		if (!name.toLowerCase().includes(search)) return
		results.push({
			label: name,
			value: { id: name, type: "scale" },
			description: descriptionEle?.(name, name),
		})
	})
	return results
}

export const searchChordTypes = (
	searchValue: string,
	descriptionEle?: (label: string, name: string) => React.ReactNode,
) => {
	const search = _.trim(searchValue.toLowerCase())
	if (search === "") return []
	const results: SearchResultItem[] = []
	_.keys(CHORDNAME_TO_SHAPE_MAPPING).map((name) => {
		if (!name.toLowerCase().includes(search)) return
		results.push({
			label: name,
			value: { id: name, type: "chord" },
			description: descriptionEle?.(name, name),
		})
	})
	return results
}

export const searchNoteTypes = (
	searchValue: string,
	descriptionEle?: (label: string, name: string) => React.ReactNode,
) => {
	const search = _.trim(searchValue.toLowerCase())
	if (search === "") return []
	const results: SearchResultItem[] = []
	ALL_NOTES.map(
		(name) =>
			name.toString().toLowerCase().includes(search) &&
			results.push({
				label: _.capitalize(name.toString()),
				value: name,
				description: descriptionEle?.(
					_.capitalize(name.toString()),
					String(name),
				),
			}),
	)

	return results
}

export const searchIntervalTypes = (
	searchValue: string,
	descriptionEle?: (label: string, name: string) => React.ReactNode,
) => {
	const search = _.trim(searchValue.toLowerCase())
	if (search === "") return []
	const results: SearchResultItem[] = []
	ALL_INTERVALS.map(
		(name) =>
			name.toLowerCase().includes(search) &&
			results.push({
				label: name,
				value: name,
				description: descriptionEle?.(name, name),
			}),
	)

	return results
}
