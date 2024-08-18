"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import AutocompleteDropdown from "@/components/Autocomplete/Dropdown"
import { LineInput } from "@/components/Inputs/LineInput"
import { getDisplayNameFromShapeMeta } from "@/musictheory/classification/naming/formatShapeNames"
import { ShapeMeta } from "@/musictheory/classification/naming/Naming"
import { searchShapesByString } from "@/musictheory/classification/naming/searchShapesByString"
import { getUrlByShapeMeta } from "@/webmeta/navigation/ShapeMetaNavigation"
import styles from "./AdvancedSearch.module.css"

export const searchTargets: {
	chords?: boolean
	scales?: boolean
} = {
	chords: false,
	scales: false,
}

export type AdvancedSearchProps = {
	className?: string
	setExternalSearchValue?: (
		updateFunction: (currentValue: string) => string,
	) => void
	externalSearchValue?: string
	searchTargets?: typeof searchTargets
	onResultClick?: (result: ShapeMeta) => void
	width?: string
	searchLimit?: number
	placeholder?: string
	textStyle?: string
	buttonContent?: React.ReactNode
	handleButtonClick?: (value: string) => void
	mutateValueBeforeSearch?: (value: string) => string
}

export const AdvancedSearch = ({
	className,
	externalSearchValue = "",
	setExternalSearchValue,
	searchTargets,
	onResultClick,
	width = "100%",
	searchLimit = 7,
	placeholder = "Manual input",
	textStyle = "subtitle",
	buttonContent,
	handleButtonClick,
	mutateValueBeforeSearch,
}: AdvancedSearchProps) => {
	const [internalSearchValue, setInternalSearchValue] = useState("")
	const setSearch = setExternalSearchValue || setInternalSearchValue
	const search = externalSearchValue || internalSearchValue

	const [focus, setFocus] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()!

	const inputRef = useRef<HTMLInputElement>(null)

	const getSearchItems = useCallback(
		() =>
			searchShapesByString(
				mutateValueBeforeSearch
					? mutateValueBeforeSearch(search)
					: search,
			).slice(0, searchLimit),
		[search, searchLimit, mutateValueBeforeSearch],
	)

	const defaultResultClick = (result: ShapeMeta) => {
		router.push(getUrlByShapeMeta(result, searchParams.toString()))
		setFocus(false)
		setSearch(() => getDisplayNameFromShapeMeta(result))
	}

	const handleResultClick = onResultClick || defaultResultClick

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const searchItems = getSearchItems()
			if (searchItems[0]) {
				onResultClick?.(searchItems[0]) // Navigate to the first result
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
			onItemClick={handleResultClick}
		>
			<LineInput
				className={styles.search + " " + className}
				value={search}
				onValueChange={(value) => setSearch(() => value)}
				placeholder={placeholder}
				textStyle={textStyle}
				styles={styles}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				onKeydown={handleKeyDown}
				onButtonClick={() => handleButtonClick?.(search)}
				ref={inputRef}
				displayButton={true}
				buttonContent={buttonContent}
			/>
		</AutocompleteDropdown>
	)
}
