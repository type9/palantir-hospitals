import { WithServerContext } from "../../trpc"
import { WithKeywordContext } from "../schema/keywordContext"
import { KeywordTokenizationGroup } from "../schema/tokenizedKeywordSchema"
import { getUniqueKeywordId } from "./getUniqueKeywordId"

export const createKeywordInstance = async ({
	token,
	contextSentence,
	category,
	measure,
	keywordContext,
	patientCaseContext,
	ctx,
}: WithServerContext<
	WithKeywordContext<{
		token: KeywordTokenizationGroup[0]["semanticName"]
		contextSentence: KeywordTokenizationGroup[0]["contextSentence"]
		category: KeywordTokenizationGroup[0]["category"]
		measure?: KeywordTokenizationGroup[0]["measure"]
	}>
>) => {
	const uniqueKeywordId = await getUniqueKeywordId({ token, category, ctx })
	const measureUniqueKeywordId = measure
		? await getUniqueKeywordId({
				token: measure.value,
				category: measure.category,
				ctx,
			})
		: null

	const keywordInstance = await ctx.db.keywordInstance.create({
		data: {
			relatedCaseId: patientCaseContext.relatedCaseId,
			uniqueKeywordId,
			contextSentence,
			keywordGroupId: keywordContext.keywordInstanceGroupId,
			measureId: measureUniqueKeywordId,
		},
		select: { id: true },
	})

	return keywordInstance.id
}
