
import { ShapeDiagram } from "@/components/ShapeDiagram"
import { createNoteContext } from "@/musictheory/classification/context/createNoteContext"
import { getKeySpaceByParentKey } from "@/musictheory/progressions/tables/KeySpaceMap"
import { getShapeFromScaleName } from "@/musictheory/shapes/scaleNameToShape"
import styles from "./KeySpaceChordDiagrams.module.css"

export type KeySpaceChordDiagramsProps = {
	rootNote: string
	scaleType: string
	className?: string
}

export const KeySpaceChordDiagrams = ({
	className,
	rootNote,
	scaleType,
}: KeySpaceChordDiagramsProps) => {
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
