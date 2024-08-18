import classNames from "classnames"
import _ from "lodash"

import { getDisplayNameFromShapeMeta } from "@/musictheory/classification/naming/formatShapeNames"
import { ShapeMeta } from "@/musictheory/classification/naming/Naming"
import styles from "./Dropdown.module.css"

export type AutocompleteDropdownProps = {
	children: React.ReactNode
	items?: ShapeMeta[]
	onItemClick?: (item: ShapeMeta) => void
	leftOffset?: string
	width?: string
	dropdownWidth?: string
}

export default function AutocompleteDropdown({
	children,
	items,
	onItemClick,
	leftOffset,
	width = "max-content",
	dropdownWidth,
}: AutocompleteDropdownProps) {
	const displayDropdown = items && items.length > 0
	return (
		<div
			className={`${styles.container} text-style-body`}
			style={{ width }}
		>
			{children}
			<div
				className={classNames(
					styles.dropdown,
					"transition-opacity",
					"origin-top transform ",
					{
						"scale-100 opacity-100": displayDropdown,
						"scale-0 opacity-0": !displayDropdown,
						flex: displayDropdown,
						hidden: !displayDropdown,
					},
				)}
				style={{
					display: "flex",
					marginLeft: leftOffset,
					width: dropdownWidth,
				}}
			>
				{items?.map((result, index) => (
					<div
						key={`${result.shape}_${result.shapeCategory}_${result.rootNote}_${index}_`}
						className={classNames(
							styles.dropdownItem,
							"transition-all ease-in-out",
						)}
						onMouseDown={() => onItemClick?.(result)}
					>
						<span className={styles.label}>
							{getDisplayNameFromShapeMeta(result)}
						</span>
						{`${_.capitalize(result.shapeCategory)}`}
					</div>
				))}
			</div>
		</div>
	)
}
