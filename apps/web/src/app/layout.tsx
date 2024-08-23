import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import { APIProvider } from "@/trpc/APIProvider"

type RootLayoutProps = {
	children: React.ReactNode
}

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"bg-background min-h-screen font-sans antialiased",
					fontSans.variable,
				)}
			>
				<APIProvider>{children}</APIProvider>
			</body>
		</html>
	)
}
