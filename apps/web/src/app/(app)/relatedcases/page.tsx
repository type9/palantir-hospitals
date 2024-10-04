"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import _ from "lodash"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/trpc/APIProvider"

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
			},
		)

	const cases = _.groupBy(data ?? [], (item) => item.parsedPatientCaseId)

	console.log(cases)
	return <div>{isLoading && "Loading..."}</div>
}
