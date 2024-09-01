import { KeywordTokenizationGroup } from "../../keywords/schema/tokenizedKeywordSchema"
import { getKeywordIndexString } from "../../keywords/utils/getTokenEmbeddingString"
import {
	NewUniqueKeyword,
	TokenizedCase,
} from "./extractAndMergeNewKeywordsFromTokens"

export const getAllUniqueKeywordInstancesFromBatch = ({
	tokenizedCases,
	existingKeywords = new Map<string, Omit<NewUniqueKeyword, "id">>(),
}: {
	tokenizedCases: TokenizedCase[]
	existingKeywords?: Map<string, Omit<NewUniqueKeyword, "id">>
}) => {
	const addKeyword = (keyword: KeywordTokenizationGroup[0]) => {
		const key = getKeywordIndexString({
			semanticName: keyword.semanticName,
			category: keyword.category,
		})
		if (existingKeywords.has(key)) return
		existingKeywords.set(key, {
			semanticName: keyword.semanticName,
			category: keyword.category,
		})
	}

	tokenizedCases.map(({ id, data }) => {
		data.context.map((keyword) => addKeyword(keyword))
		data.procedures.map((procedure) =>
			procedure.map((kw) => addKeyword(kw)),
		)
		data.result.map((kw) => addKeyword(kw))
	})

	return existingKeywords
}
