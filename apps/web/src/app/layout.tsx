import "./globals.css"

import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import classNames from "classnames"

import { AnalyticsWrapper } from "@/components/Analytics/AnalyticsWrapper"
import { GlobalLayout } from "@/components/Layouts/GlobalLayout"
import { Loading } from "@/components/Loading"
import { ExternalInputProvider } from "@/components/MidiInput/ExternalInputProvider"
import { UserProvider } from "@/components/Providers/UserProvider"
import { fontIndex } from "@/fonts/fontIndex"
import { DEFAULT_METADATA } from "@/webmeta/metadata/defaultMetadata"

export const metadata = DEFAULT_METADATA

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
				<UserProvider>
					<ExternalInputProvider>
						<GlobalLayout
							title={"ColorChords"}
							displaySearch={true}
						>
							<Suspense fallback={<Loading />}>
								{children}
							</Suspense>
							<AnalyticsWrapper />
							<SpeedInsights />
						</GlobalLayout>
					</ExternalInputProvider>
				</UserProvider>
			</body>
		</html>
	)
}
