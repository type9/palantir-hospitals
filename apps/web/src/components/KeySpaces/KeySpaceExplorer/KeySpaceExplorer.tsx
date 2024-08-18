import Link from "next/link"

import { getKeySpaceUrl } from "@/webmeta/navigation/UrlDefinitions"
import { getKeySpaceRowItems } from "./getKeySpaceRowItems"
import { KeySpaceDegreeHeader } from "./KeySpaceDegreeHeader"
import styles from "./KeySpaceExplorer.module.css"
import { KeySpaceExplorerRow } from "./KeySpaceExplorerRow"

export type KeySpaceExplorerProps = {
	rootNote: string
	scaleType: string
	centerDegree?: number
	childShapeLength?: number
}

export const KeySpaceExplorer = ({
	rootNote,
	scaleType,
	centerDegree,
	childShapeLength = 3,
}: KeySpaceExplorerProps) => {
	const keySpaceRowItems = getKeySpaceRowItems({
		rootNote,
		scaleType,
		centerDegree,
		childShapeLength,
	})
	const middleRow = Math.floor(keySpaceRowItems.length / 2)
	return (
		<div className={styles.container}>
			<KeySpaceDegreeHeader centerDegree={centerDegree} />
			{keySpaceRowItems.map((rowProps, rowIndex) => (
				<Link
					key={`keySpaceExplorerRow_${rowProps.keySpace.parentShape.getShapeNames()?.[0]}`}
					href={getKeySpaceUrl({
						rootNote,
						scaleShape: rowProps.keySpace.parentShape,
						degree: centerDegree,
					})}
				>
					<KeySpaceExplorerRow
						className={`${styles.keySpaceRow} ${
							rowIndex === middleRow ? styles.rowFocus : ""
						}`}
						{...rowProps}
					/>
				</Link>
			))}
		</div>
	)
}
