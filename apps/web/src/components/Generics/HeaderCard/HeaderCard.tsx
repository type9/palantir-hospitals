import styles from "./HeaderCard.module.css"

export interface HeaderCardProps {
	className?: string
	title?: React.ReactNode
	children?: React.ReactNode
	styles?: ElementCSSInlineStyle
}

export default function HeaderCard({
	className,
	title,
	children,
}: HeaderCardProps) {
	return (
		<div className={styles.headerCard + " " + className}>
			<div className={styles.titleWrapper}>
				<div className={styles.title}>{title}</div>
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	)
}
