import Link, { LinkProps } from "next/link"
import styles from "./PillSwitch.module.css"

export type PillSwitchItem = {
	label?: string
	link?: string
	active?: boolean
}
export type PillSwitchProps = {
	className?: string
	width?: string
	style?: React.CSSProperties
	items?: PillSwitchItem[]
	linkOptions?: Omit<LinkProps, "href" | "className">
}

export const PillSwitch = ({
	className,
	width,
	style,
	items = [],
	linkOptions = {},
}: PillSwitchProps) => {
	return (
		<div
			className={className + " " + styles.switchContainer}
			style={{ ...style, width: width ?? "max-content" }}
		>
			{items.map((item, index) => (
				<Link
					key={`${item.label}_${index}`}
					href={item.link ?? ""}
					className={
						styles.item + " " + (item.active ? styles.active : "")
					}
					{...linkOptions}
				>
					{item.label}
				</Link>
			))}
		</div>
	)
}
