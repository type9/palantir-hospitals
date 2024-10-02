import _ from "lodash"

import { api } from "@/trpc/APIProvider"
import { ChartDisplay } from "../../components/chart-display"

export const FalsePositivesTab: React.FC = ({}) => {
	const { data, isLoading, error } =
		api.dashboardRouter.getSimilarIllnessMetrics.useQuery({
			take: 10,
			orderBy: [{ lift: "desc" }, { confidence: "desc" }],
			select: {
				confidence: true,
				lift: true,
				uniqueKeywordNames: true,
				supportAAndBCaseIds: true,
			},
		})

	return (
		<div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{isLoading && <div>Loading...</div>}
			{data?.map((item) => (
				<ChartDisplay
					key={item.uniqueKeywordNames[0]}
					name={_.capitalize(item.uniqueKeywordNames.at(-1)) ?? ""}
				/>
			))}
		</div>
	)
}
