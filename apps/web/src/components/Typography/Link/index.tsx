import styles from "./Link.module.css"

import NextLink from "next/link"

export type LinkProps = {
	className?: string
	href: string
	children?: React.ReactNode
}

export default function Link({ className, href, children }: LinkProps) {
	return (
		<NextLink href={href} className={styles.link + " " + className}>
			{children}
		</NextLink>
	)
}
