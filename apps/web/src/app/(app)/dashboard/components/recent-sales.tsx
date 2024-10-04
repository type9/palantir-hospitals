import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import _ from "lodash"

import { api } from "@/trpc/APIProvider"

export function RecentSales() {
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

	return (
		<div className="flex flex-col gap-1 overflow-scroll">
			{isLoading && <div>Loading...</div>}
			{data?.map((item) => (
				<Link
					className="hover:bg-muted/50 hover:text-muted-foreground flex cursor-pointer items-center rounded-sm p-2 transition"
					key={item.keywordGroupBId}
					href={{
						pathname: "/relatedcases",
						query: {
							caseParams: JSON.stringify({
								uniqueKeywordIds: item.uniqueKeywordIds,
								parsedCaseIds: item.supportAAndBCaseIds,
							}),
						},
					}}
				>
					<div>
						<p className="text-sm font-medium leading-none">
							{_.capitalize(item.uniqueKeywordNames[0])}
						</p>
						<p className="text-muted-foreground text-sm">
							{item.uniqueKeywordNames.length > 1
								? `(${item.uniqueKeywordNames.slice(1).join(", ")})`
								: " "}
						</p>
					</div>
					<div className="font-small ml-auto text-sm">
						{item.supportAAndBCasesCount} Cases
					</div>
				</Link>
			))}
		</div>
	)
}
