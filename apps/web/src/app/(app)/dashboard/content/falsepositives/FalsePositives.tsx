import React from "react"
import _ from "lodash"

import { Button } from "@/components/ui/button"
import { api } from "@/trpc/APIProvider"
import { ChartDisplay } from "../../components/chart-display"
import { SymptomsChartBarSmall } from "../../components/symptoms-chart-bar-small"

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
		<>
			<h1 className="text-2xl font-bold">
				Diseases with High Symptom Overlap
			</h1>
			<p className="text-muted-foreground max-w-2xl text-sm">
				Diseases below have high overlap with COVID-19. Symptoms are
				graphed by the 5 most common symptoms that directly identify
				that illness. If the patient does not exhibit the the graphed
				symptoms, it is possible to rule out that disease
			</p>
			<hr></hr>
			<div className="grid flex-1 scroll-mt-20 items-start gap-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:gap-12">
				{isLoading && <div>Loading...</div>}
				{data?.map((item) => (
					<ChartDisplay
						key={item.uniqueKeywordNames[0]}
						name={`conf: ${_.truncate(String(item.confidence), { length: 12 })} \n| lift: ${_.truncate(String(item.lift), { length: 12 })}`}
						barRight={<Button size="sm">View Cases</Button>}
					>
						<SymptomsChartBarSmall
							title={
								_.capitalize(item.uniqueKeywordNames.at(-1)) ??
								""
							}
							description={""}
							illnessSemanticName={
								item.uniqueKeywordNames[0] ?? ""
							}
							footer={
								<>
									<div className="flex gap-2 font-medium leading-none"></div>
									<div className="text-muted-foreground leading-none">
										( {item.uniqueKeywordNames.join(", ")} )
									</div>
								</>
							}
						/>
					</ChartDisplay>
				))}
			</div>
		</>
	)
}
