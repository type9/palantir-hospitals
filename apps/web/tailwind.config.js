/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			spacing: {
				medium: "2rem",
				gutter: "1rem",
				small: "0.5rem",
				tiny: "0.1rem",
				button: "0.25rem",
				3: "0.75rem",
			},
			borderRadius: {
				default: "12px",
				small: "8px",
				tiny: "6px",
				boxcorner: "2px",
			},
			fontSize: {
				"body-small": "0.75rem",
				body: "1rem",
				subtitle: "1.5rem",
				title: "2rem",
			},
			letterSpacing: {
				"body-small": "0.04rem",
				body: "0.04rem",
				subtitle: "0.025rem",
				title: "0.05rem",
			},
			fontWeight: {
				normal: "300",
				subtitle: "400",
				title: "400",
			},
			fontFamily: {
				graphikLCG: ["GraphikLCG", "sans-serif"],
				nothingYouCouldDo: [
					"var(--font-nothing-you-could-do)",
					"cursive",
				],
				inter: ["var(--font-inter)", "sans-serif"],
			},
			colors: {
				primary: {
					primary: "#191b1d",
					secondary: "#6f6f6f",
					tertiary: "#c7c7c7",
				},
				secondary: {
					primary: "#ffffff",
					secondary: "#333333",
				},
				background: {
					primary: "#f4f4f4",
					secondary: "#ffffff",
					tertiary: "#191b1d",
				},
				accent: {
					success: "#3ad59f",
					failure: "#d53369",
					warning: "#daae51",
					primary: "#b0f4ee",
					"primary-dark": "#0ACCD9",
					secondary: "#fbde8c",
					"secondary-dark": "#F9C74F",
					tertiary: "#f0bff8",
					"tertiary-dark": "#D574F1",
				},
			},
		},
		backgroundImage: {
			"gradient-primary":
				"linear-gradient(160deg, #d53369 0%, #daae51 100%)",
		},
		fontFamily: {
			primary: ['"Graphik LCG"'],
			secondary: ['"Nunito Sans"', "sans-serif"],
			numerals: ['"Miltonian"', "serif"],
		},
		boxShadow: {
			highlight: "1px 0px 5px #cdcecf",
			bar: "0px 5px 0px rgba(0, 0, 0, 0.05)",
			card: "5px 5px 0px rgba(0, 0, 0, 0.08)",
			"card-pressed": "3px 3px 0px rgba(0, 0, 0, 0.08)",
		},
	},
	plugins: [],
}
