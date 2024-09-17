import { OverviewTab } from "./overview"
import { RelatedCasesTab } from "./relatedcases"

export const tabContent: { id: string; content: React.FC }[] = [
	{
		id: "overview",
		content: OverviewTab,
	},
	{
		id: "related-cases",
		content: RelatedCasesTab,
	},
]
