import { createNoteContext } from "@/musictheory/classification/context/createNoteContext"
import { getChildShapesOfAllInversions } from "@/musictheory/progressions/utils/getChildShapesOfAllInversions"
import { getShapeFromScaleName } from "@/musictheory/shapes/scaleNameToShape"
import { centerElementAtIndex } from "@/utils/centerElementAtIndex"
import { KeySpaceExplorerProps } from "./KeySpaceExplorer"
import { KeySpaceExplorerRowProps } from "./KeySpaceExplorerRow"

export const getKeySpaceRowItems = ({
	rootNote,
	scaleType,
	centerDegree = 4,
	childShapeLength = 3,
}: KeySpaceExplorerProps): KeySpaceExplorerRowProps[] => {
	const centerScaleShape = getShapeFromScaleName(scaleType)
	if (!centerScaleShape) return []

	const keySpaces = getChildShapesOfAllInversions({
		rootShape: centerScaleShape,
		childShapeLength,
	})

	const centerDegreeIndex = centerDegree - 1

	return centerElementAtIndex(keySpaces, 0).map((keySpace) => {
		const { getDisplayNoteFromIndexOfContext } = createNoteContext({
			rootNote,
			contextShape: keySpace.parentShape,
		})

		return {
			rootNote,
			keySpace,
			items: centerElementAtIndex(
				keySpace.childShapes,
				centerDegreeIndex,
			).map(({ childShape, fromIndex }) => ({
				shape: childShape,
				degree: fromIndex + 1,
				highlightType:
					centerScaleShape.key === keySpace.parentShape.key && //highlights if we're on the centerScale and the degree is the center degree
					fromIndex === centerDegreeIndex
						? "center"
						: undefined,
				rootNote: getDisplayNoteFromIndexOfContext({
					index: fromIndex,
				}),
			})),
		}
	})
}
