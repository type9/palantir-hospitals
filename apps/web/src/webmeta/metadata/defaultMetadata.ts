import { Metadata } from "next"

export const DEFAULT_METADATA: Metadata = {
	metadataBase: new URL("https://colorchords.app"),
	generator: "NeonChords",
	applicationName: "NeonChords",
	referrer: "origin-when-cross-origin",
	keywords: [
		"Neon",
		"NeonChords",
		"Music",
		"Music Theory",
		"Play Chords",
		"Chords",
		"Scales",
		"Key Signature",
		"Jazz",
		"Music Reference",
	],
	creator: "Gabriel Lee",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	title: "NeonChords",
	description: "Harmony engine and references for 12-tone equal temperament",
	openGraph: {
		type: "website",
		locale: "en_IE",
		title: "NeonChords",
		description:
			"Harmony engine and references for 12-tone equal temperament",
		images: [
			{
				url: "/opengraphic.png",
				width: 1200,
				height: 628,
				alt: "NeonChords - Music Engine and Reference",
				type: "image/jpeg",
			},
		],
		siteName: "NeonChords",
	},
}
