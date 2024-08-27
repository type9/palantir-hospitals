import {
	KeywordCategory,
	KeywordInstance,
	UniqueKeyword,
} from "@colorchordsapp/db"

import { WithServerContext } from "../../trpc"
import { WithKeywordContext } from "../schema/keywordContext"
import { KeywordTokenizationGroup } from "../schema/tokenizedKeywordSchema"
import { getUniqueTokenEmbedding } from "./getTokenEmbeddingString"
import { insertUniqueKeywordWithVector } from "./insertWithVector"
import {
	getKeywordSimilarity,
	KEYWORD_SIMILARITY_THRESHOLD,
} from "./keywordSimilarity"
import { queryUniqueKeywordByVector } from "./vectorSearchQuery"

export const getUniqueKeywordId = async ({
	token,
	category,
	ctx,
}: WithServerContext<{
	token: UniqueKeyword["semanticName"]
	category: KeywordCategory
}>) => {
	const { embedding } = await getUniqueTokenEmbedding({
		token,
		tokenCategory: category,
	})

	const similarUniqueKeywords = await queryUniqueKeywordByVector({
		vector: embedding,
		ctx,
	})

	const mergableKeywords = similarUniqueKeywords
		.map((keyword) => ({
			keyword,
			similarity: getKeywordSimilarity({
				keywordA: {
					semanticName: token,
					embedding,
					category,
				},
				keywordB: {
					semanticName: keyword.semanticName,
					embedding: keyword.vector,
					category: keyword.category,
				},
			}),
		}))
		.filter((result) => result.similarity >= KEYWORD_SIMILARITY_THRESHOLD)
		.sort((a, b) => b.similarity - a.similarity)
		.map((result) => result.keyword)

	let uniqueKeywordId = mergableKeywords?.[0]?.id

	if (mergableKeywords?.[0]) {
		console.log(
			`Merging "${token}" with "${mergableKeywords[0].semanticName}"`,
		)
	}

	if (!uniqueKeywordId) {
		uniqueKeywordId = await insertUniqueKeywordWithVector({
			data: {
				semanticName: token,
				category,
				vector: embedding,
			},
			ctx,
		}).then((result) => result.id)
	}

	if (!uniqueKeywordId)
		throw new Error(
			"Error creating KeywordInstace. Missing UniqueKeywordId",
		)

	return uniqueKeywordId
}
