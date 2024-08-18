"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import AutocompleteDropdown from "@/components/Autocomplete/Dropdown"
import { LineInput } from "@/components/Inputs/LineInput"
import { getDisplayNameFromShapeMeta } from "@/musictheory/classification/naming/formatShapeNames"
import { ShapeMeta } from "@/musictheory/classification/naming/Naming"
import { searchShapesByString } from "@/musictheory/classification/naming/searchShapesByString"
import { getUrlByShapeMeta } from "@/webmeta/navigation/ShapeMetaNavigation"
import styles from "./BigSearch.module.css"

export const searchTargets: {
	chords?: boolean
	scales?: boolean
} = {
	chords: false,
	scales: false,
}

export type BigSearchProps = {
	className?: string
	searchTargets?: typeof searchTargets
	onResultClick?: (result: ShapeMeta) => void
	width?: string
	searchLimit?: number
	placeholder?: string
	textStyle?: string
	displayButton?: boolean
}

export default function BigSearch({
	className,
	searchTargets,
	width = "100%",
	searchLimit = 7,
	placeholder = "Search",
	textStyle = "text-style-subtitle",
	displayButton = false,
}: BigSearchProps) {
	const [search, setSearch] = useState("")
	const [focus, setFocus] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()!

	const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element

	const getSearchItems = useCallback(
		() => searchShapesByString(search).slice(0, searchLimit),
		[search, searchLimit],
	)

	const onResultClick = (result: ShapeMeta) => {
		router.push(getUrlByShapeMeta(result, searchParams.toString()))
		setFocus(false)
		setSearch(getDisplayNameFromShapeMeta(result))
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const searchItems = getSearchItems()
			if (searchItems[0]) {
				onResultClick(searchItems[0]) // Navigate to the first result
			}
			setFocus(false)
			if (inputRef.current) inputRef.current.blur()
		}
	}

	return (
		<AutocompleteDropdown
			items={focus ? getSearchItems() : []}
			dropdownWidth={"100%"}
			width={width}
			onItemClick={onResultClick}
		>
			<LineInput
				className={className}
				value={search}
				onValueChange={setSearch}
				placeholder={placeholder}
				textStyle={textStyle}
				styles={styles}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				onKeydown={handleKeyDown}
				displayButton={displayButton}
				ref={inputRef}
			/>
		</AutocompleteDropdown>
	)
}
