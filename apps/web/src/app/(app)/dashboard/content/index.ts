import { FalsePositivesTab } from "./falsepositives"
import { OverviewTab } from "./overview"

export const tabContent: { id: string; title: string; content: React.FC }[] = [
	{
		id: "overview",
		content: OverviewTab,
		title: "Symptom Overview",
	},
	{
		id: "False Positives",
		title: "False Positives",
		content: FalsePositivesTab,
	},
]
