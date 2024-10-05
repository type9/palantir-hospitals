"use client"

import {
	Bar,
	BarChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts"
import stc from "string-to-color"

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/trpc/APIProvider"

export function Overview() {
	const { data, isLoading, error } =
		api.dashboardRouter.getSymptomMetrics.useQuery({
			take: 10,
			orderBy: [
				{ lift: "desc" },
				{ confidence: "desc" },
				{ supportAAndBCasesCount: "desc" },
			],
			where: { supportAAndBCasesCount: { gt: 1 } },
		})

	const symptomsData = data?.map((item) => ({
		name: item.uniqueKeywordNames[0],
		lift: item.lift,
		caseCount: item.supportAAndBCasesCount,
		fill: stc(item.uniqueKeywordNames[0]),
	}))

	const chartConfig = {
		symptom: {
			label: "Symptom",
		},
		confidence: {
			label: "Confidence",
		},
	}

	return (
		<ResponsiveContainer width="100%" height={400}>
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square"
			>
				<PieChart>
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelKey="visitors"
								nameKey="month"
								indicator="line"
							/>
						}
					/>
					<Pie
						data={symptomsData}
						dataKey="caseCount"
						outerRadius={"60%"}
					/>
					<Pie
						data={symptomsData}
						dataKey="lift"
						innerRadius={"70%"}
						outerRadius={"90%"}
					/>
				</PieChart>
			</ChartContainer>
		</ResponsiveContainer>
	)
}
