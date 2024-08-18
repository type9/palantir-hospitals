import _ from "lodash"

import { Shape } from "@/musictheory/models/Shape"
import { addQueryParamsToUrl } from "./ShapeMetaNavigation"

// Calculator Pages
export const dim6Calc = "/dim6"
export const noteCalc = "/notecalculator"

//Tools
export const liveCompanion = "/companion"

// Library
export const chordsAllUrl = `/chords/all`

export const getChordDetailsUrl = ({
	rootNote,
	type,
}: {
	rootNote?: string
	type: string
}) =>
	`/chords/${encodeURIComponent(
		rootNote ? `${_.capitalize(rootNote)}_${type}` : type,
	)}`

export const scalesAllUrl = `/scales/all`

export const getScaleDetailsUrl = ({
	rootNote,
	type,
}: {
	rootNote?: string
	type: string
}) =>
	`/scales/${encodeURIComponent(
		rootNote ? `${_.capitalize(rootNote)}_${type}` : type,
	)}`

// Models
export const keysAllUrl = `/keys`

export const getKeyDetailsUrl = ({
	rootNote,
	scaleShape,
	degree,
	chordLength,
}: {
	rootNote: string
	scaleShape: Shape
	degree?: number
	chordLength?: number
}) => {
	const scaleName = scaleShape.getShapeName()
	return addQueryParamsToUrl({
		path: `${keysAllUrl}/${encodeURIComponent(
			_.capitalize(rootNote),
		)}_${_.capitalize(scaleName)}`,
		queries: [
			{
				name: "degree",
				value: degree,
			},
			{
				name: "chordLength",
				value: chordLength,
			},
		],
	})
}

export const getShapesUrl = ({
	rootNote,
	shape,
	inversionIndex,
	searchParams,
}: {
	rootNote?: string
	shape: Shape
	inversionIndex?: number
	searchParams?: string
}) => {
	const shapeCategory = shape.getShapeName()
	return addQueryParamsToUrl({
		path: `/${shape.getShapeCategory()}s/${encodeURIComponent(
			rootNote
				? `${_.capitalize(rootNote)}_${shapeCategory}`
				: shapeCategory,
		)}`,
		queries: [
			{
				name: "inversionIndex",
				value: inversionIndex,
			},
		],
		searchParams,
	})
}

export const keySpaceUrl = `/keyspaces`

export const getKeySpaceUrl = ({
	rootNote,
	scaleShape,
	degree,
	chordLength,
}: {
	rootNote: string
	scaleShape: Shape
	degree?: number
	chordLength?: number
}) => {
	const scaleName = scaleShape.getShapeName()
	return addQueryParamsToUrl({
		path: `${keySpaceUrl}/${encodeURIComponent(
			_.capitalize(rootNote),
		)}_${_.capitalize(scaleName)}`,
		queries: [
			{
				name: "degree",
				value: degree,
			},
			{
				name: "chordLength",
				value: chordLength,
			},
		],
	})
}
