"use client"

import Link from "next/link"

import {
	getScaleDetailsUrl,
	scalesAllUrl,
} from "@/webmeta/navigation/UrlDefinitions"

export type ScaleLinkProps = {
	label: React.ReactNode
	root?: string
	type?: string
	size?: number
}

export default function ScaleLink({ label, root, type, size }: ScaleLinkProps) {
	const link = getScaleDetailsUrl({ rootNote: root, type: type ?? "" })
	return (
		<Link
			href={root && link ? link : scalesAllUrl}
			style={{ fontSize: `${size}rem` }}
		>
			{label}
		</Link>
	)
}
