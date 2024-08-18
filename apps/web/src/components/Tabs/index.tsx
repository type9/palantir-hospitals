import styles from "./Tabs.module.css"

import Link from "next/link"

export type TabItem = {
	id: string
	label: string
	href: string
}

export type TabsProps = {
	currentTabId?: string
	tabItems?: TabItem[]
}

export default function Tabs({ currentTabId, tabItems = [] }: TabsProps) {
	return (
		<div className={styles.container}>
			{tabItems.map((t) => (
				<Link
					key={t.id}
					className={
						t.id === currentTabId
							? styles.tabItem + " " + styles.active
							: styles.tabItem
					}
					href={t.href}
				>
					{t.label}
				</Link>
			))}
		</div>
	)
}
