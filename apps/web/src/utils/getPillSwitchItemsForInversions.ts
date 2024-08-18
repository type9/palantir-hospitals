import _ from "lodash"

import { PillSwitchItem } from "@/components/Generics/PillSwitch"
import { Shape } from "@/musictheory/models/Shape"
import { getShapesUrl } from "@/webmeta/navigation/UrlDefinitions"

export const inversionNames: Record<number, string> = {
	0: "Root",
	1: "1st",
	2: "2nd",
	3: "3rd",
	4: "4th",
	5: "5th",
	6: "6th",
	7: "7th",
	8: "8th",
	9: "9th",
	10: "10th",
	11: "11th",
	12: "12th",
	13: "13th",
	14: "14th",
	15: "15th",
}
export const getPillSwitchItemsForInversions = ({
	rootNote,
	shape,
	currentInversion,
}: {
	rootNote: string
	shape: Shape
	currentInversion?: number
}): PillSwitchItem[] =>
	_.range(shape.elements.length + 1).map((_, index) => ({
		label: inversionNames[index] ?? index.toString(),
		value: index,
		active: index === currentInversion,
		link: getShapesUrl({ rootNote, shape, inversionIndex: index }),
	}))
