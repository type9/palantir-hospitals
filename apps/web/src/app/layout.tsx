import "./globals.css"

import classNames from "classnames"

import { fontIndex } from "@/fonts/fontIndex"

export const metadata = {}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			className={classNames(
				fontIndex.graphikLCG.className,
				fontIndex.nothingYouCouldDo.variable,
				fontIndex.inter.variable,
			)}
		>
			<head>
				<meta
					content="width=device-width, initial-scale=1"
					name="viewport"
				/>
			</head>
			<body>
				<div id="portal-root" className="transition"></div>
			</body>
		</html>
	)
}
