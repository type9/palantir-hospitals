import { ShapeMeta } from "@/musictheory/classification/naming/Naming"
import { getChordDetailsUrl, getScaleDetailsUrl } from "./UrlDefinitions"

export const addQueryParamsToUrl = ({
	path,
	queries,
	searchParams,
}: {
	path: string
	queries: { name: string; value?: string | number }[]
	searchParams?: string
}) => {
	const params = new URLSearchParams(searchParams)

	queries.forEach(({ name, value }) => {
		if (value == undefined && value == null) return
		if (name === "inversionIndex" && value === 0) return
		params.set(name, String(value))
	})

	// Convert the URLSearchParams object to a string and check if it's empty
	const paramString = params.toString()
	if (paramString) return `${path}?${paramString}` // Append the query string to the path

	return path // Return the original path if no valid query parameters are present
}

export const getUrlByShapeMeta = (
	shapeMeta: ShapeMeta,
	searchParams?: string,
) => {
	switch (shapeMeta.shapeCategory) {
		case "scale":
			return addQueryParamsToUrl({
				path: getScaleDetailsUrl({
					rootNote: shapeMeta.rootNote,
					type: shapeMeta.shapeType,
				}),
				queries: [
					{
						name: "inversionIndex",
						value: shapeMeta.inversionIndex,
					},
				],
				searchParams,
			})
		case "chord":
			return addQueryParamsToUrl({
				path: getChordDetailsUrl({
					rootNote: shapeMeta.rootNote,
					type: shapeMeta.shapeType,
				}),
				queries: [
					{
						name: "inversionIndex",
						value: shapeMeta.inversionIndex,
					},
				],
				searchParams,
			})
		default:
			return "/"
	}
}
