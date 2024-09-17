import { OverviewTab } from "./overview"
import { RelatedCasesTab } from "./relatedcases"

export const tabContent: { id: string; title: string; content: React.FC }[] = [
	{
		id: "overview",
		content: OverviewTab,
		title: "Overview",
	},
	{
		id: "related-cases",
		title: "Related Cases",
		content: RelatedCasesTab,
	},
]
