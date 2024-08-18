import styles from "./PillCard.module.css"

export type PillCardProps = {
	className?: string
	children?: React.ReactNode
	label?: string
	width?: string
	style?: React.CSSProperties
}

export const PillCard = ({
	className,
	label,
	children,
	width,
	style,
}: PillCardProps) => {
	return (
		<label
			className={className + " " + styles.inputContainer}
			style={{ ...style, width: width ?? "max-content" }}
		>
			<span className={`${styles.label} text-style-bodySmall`}>
				{label}
			</span>
			<div className={`${styles.content} text-style-bodySmall`}>
				{children}
			</div>
		</label>
	)
}
