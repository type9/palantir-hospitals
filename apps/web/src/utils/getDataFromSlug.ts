import _ from "lodash"

import { ShapePageProps } from "@/app/(shapes)/utils"
import { KeySpaceExplorerViewProps } from "@/components/views/Key/KeySpaceExplorerView"
import {
	ShapeCategory,
	ShapeMeta,
} from "@/musictheory/classification/naming/Naming"
import {
	getShapeMetasFromName,
	normalizeSearchTerm,
} from "@/musictheory/classification/naming/searchUtils"
import { Note } from "@/musictheory/models/Note"
import { isValidScaleType, Scale } from "@/musictheory/models/Scale"
import { isValidNote } from "@/musictheory/notes/formatting"

export const getShapeMetasFromShapeParams = (
	params: ShapePageProps["params"],
	shapeCategory: ShapeCategory,
	searchParams?: ShapePageProps["searchParams"],
): ShapeMeta | undefined => {
	const splitSlug = _.split(decodeURIComponent(params.slug), "_", 2)
	const inversionIndex = Number(searchParams?.inversionIndex)

	if (splitSlug.length === 0) return undefined
	if (!splitSlug[0]) return undefined

	// search first term as shape Type
	if (splitSlug.length === 1)
		return (
			getShapeMetasFromName(normalizeSearchTerm(splitSlug[0]), [
				shapeCategory,
			])?.[0] ?? undefined
		)

	//if we have two terms but the first note is invalid
	if (
		splitSlug.length > 1 &&
		!isValidNote(splitSlug[0].toLowerCase() ?? "") &&
		splitSlug[1]
	)
		return (
			getShapeMetasFromName(normalizeSearchTerm(splitSlug[1]), [
				shapeCategory,
			])?.[0] ?? undefined
		)

	//at this point rootNote has to be valid.
	if (splitSlug[1])
		return {
			...getShapeMetasFromName(normalizeSearchTerm(splitSlug[1]), [
				shapeCategory,
			])?.[0]!,
			rootNote: splitSlug[0].toLowerCase(),
			inversionIndex,
		}
}

export const getScaleFromSlug = (slug: string) => {
	const [root, type] = _.split(slug, "_", 2)
	if (!root) return undefined
	if (!isValidNote(root.toLowerCase() ?? "") || !isValidScaleType(type ?? ""))
		return undefined
	return new Scale({
		root: new Note(root.toLowerCase()),
		type,
	})
}

export const getKeySpaceFromSlug = (
	slug: string,
): KeySpaceExplorerViewProps | undefined => {
	const [root, type] = _.split(decodeURIComponent(slug), "_", 2)
	if (!root || !type) return undefined
	if (!isValidNote(root.toLowerCase() ?? "") || !isValidScaleType(type ?? ""))
		return undefined

	return { scaleType: type, rootNote: root }
}
