import React from "react"
import defaultStyles from "./LineInput.module.css"
import { IconArrowRight } from "@tabler/icons-react"
import classNames from "classnames"

export type LineInputProps = {
	styles?: typeof defaultStyles
	className?: string
	value?: string
	onValueChange?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
	label?: string
	placeholder?: string
	width?: string
	status?: "success" | "failure" | undefined
	textStyle?: string
	onKeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
	displayButton?: boolean
	onButtonClick?: () => void
	buttonContent?: React.ReactNode
}

export const LineInput = React.forwardRef<HTMLInputElement, LineInputProps>(
	(
		{
			styles = defaultStyles,
			className,
			value = "",
			onValueChange,
			onBlur,
			onFocus,
			label,
			placeholder,
			width,
			status,
			textStyle,
			onKeydown,
			displayButton = false,
			onButtonClick,
			buttonContent = <IconArrowRight size={16} />,
		},
		ref,
	) => {
		return (
			<label
				className={classNames(className)}
				style={{ width: width ?? "100%" }}
			>
				{label && <span className={styles.label}>{label}</span>}
				<div className="flex w-full flex-nowrap">
					<input
						className={classNames(
							textStyle,
							`transition-all border border-secondary-secondary rounded-l-tiny bg-transparent w-full py-small px-gutter flex-1 focus:border-secondary-secondary focus:outline-primary-secondary focus:bg-primary-primary focus:text-secondary-primary`,
							{
								"rounded-r-tiny": !displayButton,
								"border-r-0": displayButton,
							},
						)}
						type="text"
						value={value}
						placeholder={placeholder}
						onChange={(event) =>
							onValueChange && onValueChange(event.target.value)
						}
						onFocus={onFocus}
						onBlur={onBlur}
						onKeyDown={onKeydown}
						ref={ref}
					/>
					{displayButton && (
						<button
							type="submit"
							className="px-3 py-2 text-white transition-all w-min bg-primary-primary rounded-r-tiny hover:bg-primary-secondary" // Tailwind classes for button
							onClick={() => onButtonClick?.()}
						>
							{buttonContent ?? <IconArrowRight size={16} />}
						</button>
					)}
				</div>
			</label>
		)
	},
)

LineInput.displayName = "LineInput"
