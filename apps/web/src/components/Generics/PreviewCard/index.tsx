import styles from "./PreviewCard.module.css"

export interface PreviewCardProps {
	className?: string
	children?: React.ReactNode
	styles?: ElementCSSInlineStyle
}

export default function PreviewCard({ className, children }: PreviewCardProps) {
	return (
		<div className={styles.card + " " + className} style={styles}>
			{children}
		</div>
	)
}
