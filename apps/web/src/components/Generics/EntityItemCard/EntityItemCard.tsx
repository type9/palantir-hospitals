import { getIcon, GetIconProps } from "@/icons/IconIndex"
import { ExtendedCSSProperties } from "@/styles/styleModels/ExtendedCSSProperties"
import styles from "./EntityItemCard.module.css"

export interface EntityItemCardProps {
	className?: string
	children?: React.ReactNode
	style?: React.CSSProperties
	accentColor?: string
	iconProps?: GetIconProps
	icon?: React.ReactNode
}

export default function EntityItemCard({
	className,
	children,
	style,
	accentColor = "",
	iconProps,
	icon,
}: EntityItemCardProps) {
	const cardStyles: ExtendedCSSProperties = {
		"--accent-color": accentColor,
	}

	return (
		<div
			className={`${styles.card}  ${className || ""} text-style-body`}
			style={{ ...style, ...cardStyles }}
		>
			<div className={styles.iconContainer}>
				{icon
					? icon
					: iconProps &&
						getIcon({
							height: "auto",
							width: "100%",
							...iconProps,
						})}
			</div>
			<div className={styles.cardInner}>
				{children}
				<div className={styles.cardArrow}>{"›"}</div>
			</div>
		</div>
	)
}
