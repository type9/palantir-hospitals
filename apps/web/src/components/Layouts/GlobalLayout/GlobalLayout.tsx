import { Suspense } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

import { MidiInputSelector } from "@/components/MidiInput/MidiInputSelector"
import NavigationMenu from "@/components/NavigationMenu"
import BrandIcon from "@/icons/BrandIcon"
import navigationCategories from "@/webmeta/navigation/NavigationCategories"
import styles from "./Layout.module.css"
import { RepsonsiveSearch } from "./RepsonsiveSearch"

export type GlobalLayoutProps = {
	children?: React.ReactNode
	className?: string
	title?: string
	displaySearch?: boolean
}

export const GlobalLayout = ({
	children,
	className,
	title,
}: GlobalLayoutProps) => {
	return (
		<div className={className + " " + styles.layout}>
			<div className={styles.header}>
				<div className={styles.headerInner}>
					<div className={styles.headerLeft}>
						<span className={styles.brand}>
							<Link className={styles.brandText} href="/">
								<BrandIcon height={"1.5rem"} width={"1.5rem"} />
							</Link>
						</span>
						{/* {title && (
							<>
								<span className={styles.separator}>/</span>
								<span className={styles.title}>{title}</span>
							</>
						)} */}
					</div>
					<div className={styles.headerMiddle}>
						<Suspense>
							<RepsonsiveSearch />
						</Suspense>
					</div>
					<div className={styles.headerRight}>
						{/* <Hamburger
							isActive={menuExpanded}
							onClick={() => setMenuExpanded(!menuExpanded)}
						/> */}
						<Suspense>
							<MidiInputSelector initialSelectedInputIndex={0} />
						</Suspense>
						<div className="bg-primary-primary h-6 w-0.5"></div>
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<SignInButton mode="modal">
								<div className="hover:border-primary-primary p-button text-secondary-primary hover:text-primary-primary bg-primary-primary color-secondary-primary hover:bg-secondary-primary text-style-button w-max cursor-pointer rounded border border-transparent transition-colors">
									Sign In
								</div>
							</SignInButton>
						</SignedOut>
					</div>
				</div>
			</div>
			<div className={styles.content}>
				{children}
				<div
					className={styles.menu}
					style={{ display: false ? "block" : "none" }}
				>
					<div style={{ height: "max-content" }}>
						<NavigationMenu items={navigationCategories} />
					</div>
				</div>
			</div>
		</div>
	)
}
