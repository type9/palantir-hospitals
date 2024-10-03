"use client"

import { ReactNode } from "react"
import _ from "lodash"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/trpc/APIProvider"

export const description = "A mixed bar chart"

export const SymptomsChartBarSmall = ({
	title,
	description,
	illnessSemanticName,
	footer,
}: {
	title?: ReactNode
	description?: ReactNode
	footer?: ReactNode
	illnessSemanticName: string
}) => {
	const { data, isLoading, error } =
		api.dashboardRouter.getSymptomsByIllness.useQuery(
			{
				limit: 7,
				illnesses: [illnessSemanticName],
			},
			{},
		)

	const chartData = data
		? data.map((item) => ({
				symptom: item.uniqueKeywordNames[0],
				confidence: item.confidence,
				lift: item.lift,
				fill: "white",
			}))
		: undefined

	const chartConfig = {
		symptom: {
			label: "Symptom",
		},
		confidence: {
			label: "Confidence",
		},
	}

	if (isLoading || chartData === undefined || chartData.length === 0) {
		return <div>Loading...</div>
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout="vertical"
						margin={{
							left: 0,
						}}
					>
						<YAxis
							dataKey="symptom"
							type="category"
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => _.capitalize(value)}
							fontSize={10}
							width={100}
						/>
						<XAxis dataKey="confidence" type="number" hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							spacing={4}
							dataKey="confidence"
							layout="vertical"
							radius={5}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				{footer}
			</CardFooter>
		</Card>
	)
}
