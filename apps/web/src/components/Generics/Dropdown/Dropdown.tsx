import styles from "./Dropdown.module.css"
import React from "react"
import classNames from "classnames"

export type DropdownItem = {
	key: string
	label?: React.ReactNode
	sublabel?: React.ReactNode
	onMouseDown?: () => void
	selected?: boolean
}

export type DropdownProps = {
	className?: string
	children: React.ReactNode
	displayDropdown?: boolean
	items?: DropdownItem[]
	leftOffset?: string
	width?: string
	dropdownWidth?: string
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
	(
		{
			className,
			children,
			displayDropdown = false,
			items = [],
			leftOffset,
			width = "max-content",
			dropdownWidth,
		}: DropdownProps,
		ref,
	) => {
		return (
			<div
				className={`${className}  ${styles.container} text-style-body`}
				style={{ width }}
				ref={ref}
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
					{items.map(({ key, label, sublabel, onMouseDown }) => (
						<div
							key={key}
							className={styles.dropdownItem}
							onMouseDown={() => onMouseDown?.()}
						>
							<span className={styles.label}>{label}</span>
							{sublabel}
						</div>
					))}
				</div>
			</div>
		)
	},
)

Dropdown.displayName = "Dropdown"

export default Dropdown
