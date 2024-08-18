import Link from "next/link"
import { IconBolt, IconTableRow } from "@tabler/icons-react"

import ElementCard from "@/components/Generics/ElementCard"
import HeaderCard from "@/components/Generics/HeaderCard/HeaderCard"
import BigSearch from "@/components/SearchBars/BigSearch"
import BrandBanner from "@/icons/BrandBanner"
import { getIcon } from "@/icons/IconIndex"
import getStaticUrl from "@/webmeta/navigation/getStaticUrl"
import { keySpaceUrl } from "@/webmeta/navigation/UrlDefinitions"
import styles from "./page.module.css"

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.home}>
				<div className={styles.banner}>
					<div
						className={styles.contentInner}
						style={{ padding: "0.5rem" }}
					>
						<BrandBanner
							width={"100%"}
							height={"100%"}
							style={{ maxWidth: "350px" }}
						/>
					</div>
				</div>
				<div className={styles.lowerPage}>
					<div className={styles.contentInner}>
						<div className={styles.menu}>
							<div className={styles.searchContainer}>
								<BigSearch
									width={"100%"}
									textStyle={"text-style-body"}
									searchTargets={{
										chords: true,
										scales: true,
									}}
									placeholder={
										"Search chords, scales, notes, and more..."
									}
								/>
							</div>

							<div className={styles.menuSection}>
								<HeaderCard title={"Shapes ›"}>
									<Link href={getStaticUrl("allScales")}>
										<ElementCard
											icon={getIcon({
												key: "sequence-structure",
												className:
													"aspect-ratio-square fill-secondary-primary w-full h-full",
											})}
											accentColor="var(--accent-color-primary)"
										>
											Scales
										</ElementCard>
									</Link>
									<Link href={getStaticUrl("allChords")}>
										<ElementCard
											icon={getIcon({
												key: "equivalent-structure",
												className:
													"aspect-ratio-square fill-secondary-primary w-full h-full",
											})}
											accentColor="var(--accent-color-secondary)"
										>
											Chords
										</ElementCard>
									</Link>
								</HeaderCard>
								<HeaderCard title={"Models ›"}>
									<Link href={keySpaceUrl}>
										<ElementCard
											icon={
												<IconTableRow
													className={
														"aspect-ratio-square text-secondary-primary h-full w-full"
													}
												/>
											}
										>
											Explore Key Spaces
										</ElementCard>
									</Link>
								</HeaderCard>
								<HeaderCard title={"Tools ›"}>
									<Link href={getStaticUrl("liveCompanion")}>
										<ElementCard
											icon={
												<IconBolt
													className={
														"aspect-ratio-square text-secondary-primary h-full w-full"
													}
												/>
											}
										>
											Live Companion
										</ElementCard>
									</Link>
								</HeaderCard>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
