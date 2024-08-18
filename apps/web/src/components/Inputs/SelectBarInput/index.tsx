import styles from "./SelectBarInput.module.css"

export type SelectBarInputProps = {
	className?: string
	options?: { id: string; label?: string; selected?: boolean }[]
	onOptionClick?: (id: string) => void
	width?: string
}

export default function SelectBarInput({
	className,
	options,
	onOptionClick,
	width,
}: SelectBarInputProps) {
	return (
		<div
			className={className + " " + styles.inputContainer}
			style={{ width: width ?? "max-content" }}
		>
			{options?.map((o) => (
				<div
					key={o.id}
					className={
						o.selected
							? styles.option + " " + styles.selected
							: styles.option
					}
					onClick={() => onOptionClick && onOptionClick(o.id)}
				>
					{o.label}
				</div>
			))}
		</div>
	)
}
