import { z } from "zod"

export const RelatedCasesPagePropsSchema = z.object({
	uniqueKeywordIds: z.array(z.string()),
	parsedCaseIds: z.array(z.string()),
})

export type RelatedCasesPageProps = z.infer<typeof RelatedCasesPagePropsSchema>

export type RelatedCasesPageParams = {
	query: RelatedCasesPageProps
}
