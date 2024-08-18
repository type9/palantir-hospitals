"use client"

import { useState } from "react"
import { IconCaretDown } from "@tabler/icons-react"

import { useClickOutside } from "@/utils/hooks/useClickOutside"
import { Dropdown, DropdownItem, DropdownProps } from "../Dropdown"
import styles from "./PillCardSelect.module.css"

export type PillCardSelectProps = {
	className?: string
	dropdownItems?: DropdownItem[]
	dropdownProps?: Omit<DropdownProps, "children" | "ref" | "onBlur">
	label?: string
	width?: string
	style?: React.CSSProperties
}

export const PillCardSelect = ({
	className,
	label,
	dropdownItems = [],
	dropdownProps,
	width,
	style,
}: PillCardSelectProps) => {
	const [displayDropdown, setDisplayDropdown] = useState<boolean>(false)
	const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() =>
		setDisplayDropdown(false),
	)

	const currentlySelected = dropdownItems.find((item) => item.selected)

	return (
		<Dropdown
			displayDropdown={displayDropdown}
			ref={dropdownRef}
			{...dropdownProps}
			items={dropdownItems.map((item) => ({
				...item,
				onMouseDown: () => {
					item.onMouseDown?.()
					setDisplayDropdown(false)
				},
			}))}
		>
			<label
				className={className + " " + styles.inputContainer}
				style={{ ...style, width: width ?? "max-content" }}
				onClick={() => setDisplayDropdown(!displayDropdown)}
			>
				<span className={`${styles.label} text-style-bodySmall`}>
					{label}
				</span>
				<div className={`${styles.content} text-style-bodySmall`}>
					{currentlySelected?.label ?? "Select"}
					<IconCaretDown size={10} />
				</div>
			</label>
		</Dropdown>
	)
}
