"use client"

import BigSearch from "@/components/SearchBars/BigSearch"
import { usePathname } from "next/navigation"

export const RepsonsiveSearch = ({ className }: { className?: string }) => {
	const pathname = usePathname()
	const displaySearch = pathname !== "/"

	if (!displaySearch) {
		return null
	}
	return (
		<BigSearch
			className={className}
			width={"100%"}
			searchTargets={{
				chords: true,
				scales: true,
			}}
			textStyle="text-style-bodySmall"
			placeholder={"Search everything"}
		/>
	)
}
