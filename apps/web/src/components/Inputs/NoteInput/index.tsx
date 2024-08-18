import styles from "./NoteInput.module.css"

export type LineInputProps = {
	className?: string
	value?: string
	onValueChange?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
	label?: string
	placeholder?: string
	width?: string
	status?: "success" | "failure" | undefined
}

export default function NoteInput({
	className,
	value = "",
	onValueChange,
	onFocus,
	onBlur,
	label,
	placeholder,
	width,
	status,
}: LineInputProps) {
	return (
		<label
			className={className + " " + styles.inputContainer}
			style={{ width: width ?? "12rem" }}
		>
			<span className={styles.label}>{label}</span>
			<input
				className={styles.input}
				type="text"
				value={value}
				placeholder={placeholder}
				onChange={(event) =>
					onValueChange && onValueChange(event.target.value)
				}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</label>
	)
}
