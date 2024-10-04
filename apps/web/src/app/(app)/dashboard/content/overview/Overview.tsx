"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { api } from "@/trpc/APIProvider"
import { Overview } from "../../components/overview"
import { RecentSales } from "../../components/recent-sales"

export const OverviewTab: React.FC = ({}) => {
	const { data, isLoading, error } =
		api.dashboardRouter.getGeneralStats.useQuery(
			{ take: 1 },
			{ enabled: true, retry: true, refetchOnMount: false },
		)

	return (
		<div>
			<div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total COVID-19 Cases
						</CardTitle>
						{/* <svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="text-muted-foreground h-4 w-4"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg> */}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.totalCOVID19Cases}
						</div>
						<p className="text-muted-foreground text-xs">
							Verified Cases
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Age
						</CardTitle>
						{/* <svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="text-muted-foreground h-4 w-4"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
						</svg> */}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.averageAgeCOVID19Cases}
						</div>
						<p className="text-muted-foreground text-xs"></p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Unique Symptoms
						</CardTitle>
						{/* <svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="text-muted-foreground h-4 w-4"
						>
							<rect width="20" height="14" x="2" y="5" rx="2" />
							<path d="M2 10h20" />
						</svg> */}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.totalUniqueSymptomsInCOVID19Cases}
						</div>
						<p className="text-muted-foreground text-xs"></p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Parsed Cases
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="text-muted-foreground h-4 w-4"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.totalParsedCases}
						</div>
						<p className="text-muted-foreground text-xs">
							{data?.totalUnparsedCases} Unparsed
						</p>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>{`Symptom Trends [EXAMPLE]`}</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<Overview />
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Top Reported Symptoms</CardTitle>
						<CardDescription>Ordered by Confidence</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentSales />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
