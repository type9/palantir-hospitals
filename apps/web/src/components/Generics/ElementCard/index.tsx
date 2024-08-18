import classNames from "classnames"

import { getIcon } from "@/icons/IconIndex"
import { ExtendedCSSProperties } from "@/styles/styleModels/ExtendedCSSProperties"
import styles from "./ElementCard.module.css"

export interface ElementCardProps {
	className?: string
	children?: React.ReactNode
	style?: ElementCSSInlineStyle
	accentColor?: string
	icon?: JSX.Element
}

export default function ElementCard({
	className,
	children,
	style,
	accentColor = "",
	icon,
}: ElementCardProps) {
	const cardStyles: ExtendedCSSProperties = {
		"--accent-color": accentColor,
	}

	return (
		<div
			className={classNames("text-style-body", styles.card, className)}
			style={{ ...style, ...cardStyles }}
		>
			<div
				className={classNames(
					styles.cardInner,
					"gap-gutter flex items-center",
				)}
			>
				{icon && (
					<div
						className={
							"bg-primary-primary p-small rounded-boxcorner flex h-8 w-8 items-center justify-center"
						}
					>
						{icon}
					</div>
				)}
				{children}
			</div>
		</div>
	)
}
