import { Inter, Nothing_You_Could_Do } from "next/font/google"
import localFont from "next/font/local"

const graphikLCG = localFont({
	src: [
		{
			path: "graphiklcg/GraphikLCG-Thin.woff2",
			weight: "100",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Extralight.woff2",
			weight: "200",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "graphiklcg/GraphikLCG-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
})

const nothingYouCouldDo = Nothing_You_Could_Do({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-nothing-you-could-do",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const fontIndex = {
	graphikLCG,
	nothingYouCouldDo,
	inter,
}

export const getFont = (name: keyof typeof fontIndex) => fontIndex[name]
