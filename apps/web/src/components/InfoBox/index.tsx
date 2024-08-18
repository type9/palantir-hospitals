import classNames from "classnames"

import styles from "./InfoBox.module.css"

export type InfoBoxProps = {
	className?: string
	children: React.ReactNode
	title?: React.ReactNode
	width?: string
	style?: React.CSSProperties
}

export default function InfoBox({
	className,
	children,
	title,
	width = "auto",
	style,
}: InfoBoxProps) {
	return (
		<div className={styles.infoBox} style={{ ...style, width }}>
			<div className={classNames("text-style-body py-small")}>
				{title}
			</div>
			<div
				className={classNames(
					className,
					"p-small border-primary-primary p-small border-t",
				)}
			>
				{children}
			</div>
		</div>
	)
}
