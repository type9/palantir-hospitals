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
	tx,
}: WithKeywordContext<{
	token: KeywordTokenizationGroup[0]["semanticName"]
	contextSentence: KeywordTokenizationGroup[0]["contextSentence"]
	category: KeywordTokenizationGroup[0]["category"]
	measure?: KeywordTokenizationGroup[0]["measure"]
}>) => {
	const uniqueKeywordId = await getUniqueKeywordId({
		token,
		category,
		tx,
		patientCaseContext,
	})
	const measureUniqueKeywordId = measure
		? await getUniqueKeywordId({
				token: measure.value,
				category: measure.category,
				tx,
				patientCaseContext,
			})
		: null
	if (uniqueKeywordId && measureUniqueKeywordId)
		console.log(`${uniqueKeywordId} ${measureUniqueKeywordId}`)

	const keywordInstance = await tx.keywordInstance.create({
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
