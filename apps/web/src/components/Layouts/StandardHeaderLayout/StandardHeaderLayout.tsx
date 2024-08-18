import classNames from "classnames"

import styles from "./Layout.module.css"

export type StandardHeaderLayoutProps = {
	children?: React.ReactNode
	className?: string
	title?: React.ReactNode
	subtitle?: React.ReactNode
	bannerUpperLeft?: React.ReactNode
	bannerUpperRight?: React.ReactNode
	bannerRight?: React.ReactNode
	underBannerLeft?: React.ReactNode
	underBannerRight?: React.ReactNode
	footer?: React.ReactNode
	maxWidthOverride?: string
}

export const StandardHeaderLayout = ({
	children,
	className,
	title,
	bannerUpperLeft,
	bannerUpperRight,
	bannerRight,
	underBannerLeft,
	underBannerRight,
	footer,
	maxWidthOverride,
}: StandardHeaderLayoutProps) => {
	return (
		<div
			className={classNames(
				styles.main,
				"px-medium pt-medium m-auto h-full w-full overflow-auto",
			)}
			style={{ maxWidth: maxWidthOverride }}
		>
			<div className={styles.banner}>
				<div className={styles.bannerUpper}>
					<div
						className={`${styles.bannerUpperLeft} text-style-subtitle`}
						style={{
							fontWeight: 400,
						}}
					>
						{bannerUpperLeft}
					</div>
					<div
						className={`${styles.bannerUpperRight} text-style-subtitle`}
						style={{
							fontWeight: 400,
						}}
					>
						{bannerUpperRight}
					</div>
				</div>
				<div className={styles.bannerInner}>
					<div
						className={"py-small flex items-center justify-center"}
					>
						<div
							className={`text-style-title flex items-center justify-center`}
						>
							{title}
						</div>
					</div>
					<div className={styles.bannerRight}>{bannerRight}</div>
				</div>
			</div>
			<div className={styles.underBanner}>
				<div className={styles.underBannerLeft}>{underBannerLeft}</div>
				<div className={styles.underBannerRight}>
					{underBannerRight}
				</div>
			</div>
			<div
				className={classNames(styles.body, "gap-medium")}
				style={{ maxWidth: maxWidthOverride }}
			>
				<div className={styles.display + " " + className}>
					{children}
				</div>
				<div className={classNames(styles.footer, "gap-medium")}>
					{footer}
				</div>
			</div>
		</div>
	)
}
