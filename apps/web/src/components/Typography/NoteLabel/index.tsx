import styles from "./NoteLabel.module.css"

export type NoteLabelProps = {
	className?: string
	label?: React.ReactNode
	sublabel?: React.ReactNode
}

export default function NoteLabel({
	className,
	label,
	sublabel,
}: NoteLabelProps) {
	return (
		<span className={className + " " + styles.container}>
			<div className={styles.label + "text-inherit"}>{label}</div>
			<div className={styles.sublabel + "text-inherit"}>{sublabel}</div>
		</span>
	)
}
