import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import _ from "lodash"
import stc from "string-to-color"

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
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke={stc(item.uniqueKeywordNames[0])}
							stroke-width="2.25"
							stroke-linecap="round"
							stroke-linejoin="round"
							className="lucide lucide-square"
						>
							<rect width="18" height="18" x="3" y="3" rx="2" />
						</svg>
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
