"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CaretSortIcon } from "@radix-ui/react-icons"
import _ from "lodash"
import stc from "string-to-color"
import { z } from "zod"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/trpc/APIProvider"
import { ChartDisplay } from "../dashboard/components/chart-display"

export const RelatedCasesPagePropsSchema = z.object({
	uniqueKeywordIds: z.array(z.string()),
	parsedCaseIds: z.array(z.string()),
})

export type RelatedCasesPageProps = z.infer<typeof RelatedCasesPagePropsSchema>

export type RelatedCasesPageParams = {
	query: RelatedCasesPageProps
}

export default function RelatedCasesPage() {
	const searchParams = useSearchParams()

	const queryProps = searchParams?.has("caseParams")
		? JSON.parse(searchParams.get("caseParams") as string)
		: { uniqueKeywordIds: [], parsedCaseIds: [] }

	const { data, isLoading } =
		api.dashboardRouter.getCasesAndKeywordInstancesByIds.useQuery(
			queryProps,
			{
				enabled:
					queryProps?.parsedCaseIds.length > 0 &&
					!!queryProps?.uniqueKeywordIds,
				retry: false,
				refetchOnMount: false,
			},
		)

	const cases = _.groupBy(data ?? [], (item) => item.parsedPatientCaseId)

	if (isLoading) return <div>Loading...</div>
	return (
		<div className={"p-8"}>
			<h1 className="text-2xl font-bold">{`Cases`}</h1>
			<p className="text-muted-foreground max-w-2xl text-sm"></p>
			<hr></hr>
			<div className="grid flex-1 scroll-mt-20 items-start gap-12 px-4 pt-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:gap-12">
				{isLoading && <div>Loading...</div>}
				{Object.values(cases).map((item) => (
					<ChartDisplay
						key={item[0]?.parsedPatientCaseId}
						name={`Case #${item[0]?.parsedPatientCaseId}`}
					>
						<div className="p-2">
							<Accordion type="single" collapsible>
								{item.map((item) => {
									return (
										<AccordionItem
											value={item.uniqueKeywordId}
										>
											<AccordionTrigger>
												<div className="flex items-center gap-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke={stc(
															item.semanticName,
														)}
														stroke-width="2.25"
														stroke-linecap="round"
														stroke-linejoin="round"
														className="lucide lucide-square"
													>
														<rect
															width="18"
															height="18"
															x="3"
															y="3"
															rx="2"
														/>
													</svg>
													{item.semanticName}
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="flex flex-col gap-2">
													<div className="flex gap-2 font-medium leading-none"></div>
													<div className="text-muted-foreground leading-none">
														{item.contextSentence}
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									)
								})}
							</Accordion>
							<Collapsible>
								<CollapsibleTrigger className="flex w-full items-center justify-between">
									See Full Notes
									<Button variant="ghost" size="sm">
										<CaretSortIcon className="h-4 w-4" />
										<span className="sr-only">Toggle</span>
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<ScrollArea className="h-[12em] w-full rounded-md border p-4">
										{item[0]?.patientNote}
									</ScrollArea>
								</CollapsibleContent>
							</Collapsible>
						</div>
					</ChartDisplay>
				))}
			</div>
		</div>
	)
}
