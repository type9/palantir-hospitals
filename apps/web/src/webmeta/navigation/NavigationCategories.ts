import { NavigationCategory } from "@/musictheory/models/Navigation"

const navigationCategories: NavigationCategory[] = [
	{
		id: "calculators",
		label: "Harmony Calculators",
		items: [
			{
				urlId: "dim6Calc",
				label: "Barry's MajDim6",
			},
			{
				urlId: "noteCalc",
				label: "Note Calculator",
			},
		],
	},
	{
		id: "library",
		label: "Library",
		items: [
			{
				urlId: "allChords",
				label: "Chords",
			},
			{
				urlId: "allScales",
				label: "Scales",
			},
		],
	},
]

export default navigationCategories
