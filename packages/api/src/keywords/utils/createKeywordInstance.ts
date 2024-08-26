import {
	KeywordCategory,
	KeywordInstance,
	KeywordInstanceGroup,
	UniqueKeyword,
} from "@colorchordsapp/db"
import { uniq } from "lodash"

import { WithServerContext } from "../../trpc"
import { WithKeywordContext } from "../schema/keywordContext"
import { getUniqueTokenEmbedding } from "./getTokenEmbeddingString"
import { insertUniqueKeywordWithVector } from "./insertWithVector"
import {
	getKeywordSimilarity,
	KEYWORD_SIMILARITY_THRESHOLD,
} from "./keywordSimilarity"
import { queryUniqueKeywordByVector } from "./vectorSearchQuery"

export const createKeywordInstance = async ({
	token,
	contextSentence,
	category,
	keywordContext,
	patientCaseContext,
	ctx,
}: WithServerContext<
	WithKeywordContext<{
		token: UniqueKeyword["semanticName"]
		contextSentence: KeywordInstance["contextSentence"]
		category: KeywordCategory
	}>
>) => {
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

	const keywordInstance = await ctx.db.keywordInstance.create({
		data: {
			relatedCaseId: patientCaseContext.relatedCaseId,
			uniqueKeywordId,
			contextSentence,
			keywordGroupId: keywordContext.keywordInstanceGroupId,
		},
		select: { id: true },
	})

	return keywordInstance.id
}
