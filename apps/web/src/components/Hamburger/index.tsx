import styles from "./Hamburger.module.css"

export interface HamburgerProps {
	size?: string
	isActive?: boolean
	onClick?: () => void
}

export default function Hamburger({
	size = "1.5rem",
	isActive = false,
	onClick,
}: HamburgerProps) {
	return (
		<div
			className={isActive ? styles.hamburgerActive : styles.hamburger}
			style={{ height: size, width: size }}
			onClick={onClick}
		>
			<span className={styles.line}></span>
			<span className={styles.line}></span>
			<span className={styles.line}></span>
		</div>
	)
}
