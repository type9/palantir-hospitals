import _ from "lodash"

import { centerElementAtIndex } from "@/utils/centerElementAtIndex"
import styles from "./KeySpaceDegreeHeader.module.css"

export type KeySpaceDegreeHeaderProps = {
	centerDegree?: number
	maxDegree?: number
}

export const KeySpaceDegreeHeader = ({
	centerDegree = 1,
	maxDegree = 7,
}: KeySpaceDegreeHeaderProps) => {
	const degrees = centerElementAtIndex(
		_.range(1, maxDegree + 1),
		centerDegree - 1,
	)

	return (
		<div className={styles.degreeHeader}>
			<div className={styles.titleFiller}></div>
			{degrees.map((degree) => (
				<div
					key={`degreeLabel_${degree}`}
					className={styles.degreeName}
				>
					{degree}
				</div>
			))}
		</div>
	)
}
