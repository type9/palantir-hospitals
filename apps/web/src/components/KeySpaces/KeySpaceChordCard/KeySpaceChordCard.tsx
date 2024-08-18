
import { ShapeDiagram } from "@/components/ShapeDiagram"
import { createNoteContext } from "@/musictheory/classification/context/createNoteContext"
import { Shape } from "@/musictheory/models/Shape"
import { getKeySpaceByParentKey } from "@/musictheory/progressions/tables/KeySpaceMap"
import { getShapeFromScaleName } from "@/musictheory/shapes/scaleNameToShape"
import styles from "./KeySpaceChordCard.module.css"

export type ChildShapeHightlight = "center" | "related"

export type ChildShapeItem = {
	rootNote?: string
	shape: Shape
	degree: number
	highlightType?: ChildShapeHightlight
}

export type KeySpaceChordCardProps = {
	rootNote: string
	scaleType: string
	className?: string
}

export const KeySpaceChordCard = ({
	className,
	rootNote,
	scaleType,
}: KeySpaceChordCardProps) => {
	const parentShape = getShapeFromScaleName(scaleType)
	if (!parentShape) return null

	const keySpace = getKeySpaceByParentKey(parentShape.key)
	const { getDisplayNoteFromIndexOfContext } = createNoteContext({
		rootNote,
		contextShape: parentShape,
	})

	return (
		<div className={styles.container + " " + className}>
			{keySpace?.childShapes.map((childShapeResult) => (
				<ShapeDiagram
					playable={true}
					key={`keySpaceChordDiagram_${childShapeResult.childShape.key}`}
					shapeKey={childShapeResult.childShape.key}
					rootNote={
						getDisplayNoteFromIndexOfContext({
							index: childShapeResult.fromIndex,
						}) ?? ""
					}
				/>
			))}
		</div>
	)
}
