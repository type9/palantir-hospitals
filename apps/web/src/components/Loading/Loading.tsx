import classNames from "classnames"
import styles from "./Loading.module.css"

export type LoadingProps = {
	children?: React.ReactNode
	isLoading?: boolean
	message?: React.ReactNode
}

export const Loading = ({ children, isLoading, message }: LoadingProps) => {
	return (
		<>
			<div
				className={styles.loadingContainer}
				style={{ display: isLoading ? "flex" : "none" }}
			>
				<div className={styles.loadingAnimation}>
					<div className={styles.circle + " " + styles.circle1}></div>
					<div className={styles.circle + " " + styles.circle2}></div>
					<div className={styles.circle + " " + styles.circle3}></div>
				</div>
				<div className={styles.message}>{message}</div>
			</div>
			<div
				className={classNames(
					"transition-all w-full h-full overflow-hidden",
					{
						"opacity-100": !isLoading,
						"opacity-0": isLoading,
					},
				)}
			>
				{children}
			</div>
		</>
	)
}
