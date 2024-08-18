import { CSSProperties } from "react"
import _ from "lodash"

import { Shape } from "@/musictheory/models/Shape"
import { KeySpace } from "@/musictheory/progressions/tables/models/KeySpacesToShapesMap"
import styles from "./KeySpaceExplorerRow.module.css"

export type ChildShapeHightlight = "center" | "related"

export type ChildShapeItem = {
	rootNote?: string
	shape: Shape
	degree: number
	highlightType?: ChildShapeHightlight
}

export type KeySpaceExplorerRowProps = {
	rootNote?: string
	keySpace: KeySpace
	items: ChildShapeItem[]
	className?: string
	rowStyle?: CSSProperties
}

export const KeySpaceExplorerRow = ({
	rootNote,
	keySpace,
	items,
	className,
	rowStyle,
}: KeySpaceExplorerRowProps) => {
	const keySpaceName = `${_.capitalize(
		rootNote,
	)} ${keySpace.parentShape.getShapeNames()?.[0]}`

	return (
		<div
			className={`${styles.container} ${className} text-style-subtitle`}
			style={rowStyle}
		>
			<div className={styles.keySpaceName}>{keySpaceName}</div>
			{items.map((childItem) => (
				<div
					key={`${keySpaceName}_${childItem.shape.getShapeNames()?.[0]}`}
					className={styles.childShapeItem}
				>{`${_.capitalize(
					childItem.rootNote,
				)} ${childItem.shape.getShapeNames()?.[0]}`}</div>
			))}
		</div>
	)
}
