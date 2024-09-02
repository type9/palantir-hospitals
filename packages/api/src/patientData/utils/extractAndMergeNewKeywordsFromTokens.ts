import { createDefaultId, UniqueKeyword } from "@colorchordsapp/db"
import { Measure } from "@colorchordsapp/db/zod"
import pLimit from "p-limit"

import { getExistingUniqueKeywordMap } from "../../keywords/utils/getExistingUniqueKeywordMap"
import {
	getKeywordIndexString,
	getUniqueTokenEmbedding,
} from "../../keywords/utils/getTokenEmbeddingString"
import { queryUniqueKeywordByVector } from "../../keywords/utils/vectorSearchQuery"
import { WithTransactionContext } from "../../trpc"
import { PatientNoteBatchKeywordTokenization } from "../schemas/patientNoteComponentsSchema"
import { getAllUniqueKeywordInstancesFromBatch } from "./getAllUniqueKeywordInstancesFromBatch"

export type TokenizedCase = {
	id: string
	data: PatientNoteBatchKeywordTokenization
}

export type NewUniqueKeyword = Omit<UniqueKeyword, "id"> & {
	vector?: number[]
	id?: string
}
export type FinalUniqueKeyword = UniqueKeyword & { vector?: number[] }
export type FinalUniqueKeywordLookup = Map<string, FinalUniqueKeyword>

export type NewMeasure = Measure

export type UniqueKeywordLookup = Map<string, NewUniqueKeyword>

const limit = pLimit(20)

//the goal is extract all new entities that need to be created and flatten it into lists of upsertable objects to remove redundant calls to the database
export const extractAndMergeNewKeywordsFromTokens = async ({
	tokenizedCases,
	existingKeywords = new Map<string, NewUniqueKeyword>(),
	mergeMaxCosineDistance = 0.1,
	tx,
}: WithTransactionContext<{
	tokenizedCases: TokenizedCase[]
	existingKeywords?: UniqueKeywordLookup
	mergeMaxCosineDistance?: number
}>) => {
	//extract all unique keywords from the tokenized cases
	const uniqueKeywords = getAllUniqueKeywordInstancesFromBatch({
		tokenizedCases,
		existingKeywords,
	})
	//get all the unique keywords that already exist in the database and merge it into a look-up map
	//at this point, any remote existing keywords will have an id
	console.time(`Checked backend for obviously existing keywords`)
	const obviouslyDedupedUniqueKeywords = await getExistingUniqueKeywordMap({
		tx,
		keywordLookupMap: uniqueKeywords,
	})
	console.timeEnd(`Checked backend for obviously existing keywords`)

	//for keywords without an id, we need to get the embeddings from the remote model
	const keywordsNotObviouslyInBackend = Array.from(
		obviouslyDedupedUniqueKeywords.values(),
	).filter((keyword) => !keyword.id)

	console.time(`Fetched embeddings for new keywords`)
	const newUniqueKeywordEmbeddings = await Promise.all(
		keywordsNotObviouslyInBackend.map(async (keyword) => ({
			keyword,
			embedding: (await getUniqueTokenEmbedding(keyword)).embedding,
		})),
	)
	console.timeEnd(`Fetched embeddings for new keywords`)

	// Initialize the final keyword lookup map and list to be upserted
	const finalKeywords: FinalUniqueKeywordLookup = new Map()
	const finalUniqueKeywordsToUpsert: NonNullable<FinalUniqueKeyword>[] = []

	console.time(`Measured embeddings and merged keywords`)

	// Check backend for all possible new unique keywords by embedding.
	await Promise.all(
		newUniqueKeywordEmbeddings.map(({ keyword, embedding }) =>
			limit(async () => {
				console.time(
					`Vector queried for remote existing keyword ${keyword.semanticName}`,
				)

				// Execute the query to find remote existing keywords.
				const remoteExistingKeyword = await queryUniqueKeywordByVector({
					vector: embedding,
					topK: 1,
					tx,
					maxCosineDistance: mergeMaxCosineDistance,
				})

				console.timeEnd(
					`Vector queried for remote existing keyword ${keyword.semanticName}`,
				)

				// If there is an existing keyword, use the remote version.
				if (remoteExistingKeyword?.[0]) {
					const remoteKeyword: FinalUniqueKeyword = {
						...remoteExistingKeyword[0],
						vector: embedding,
						id: remoteExistingKeyword[0].id,
					}
					finalKeywords.set(
						getKeywordIndexString(remoteKeyword),
						remoteKeyword,
					)
					return
				}

				// If there is no existing keyword, generate a new id and create a new final keyword.
				const indexString = getKeywordIndexString(keyword)
				const existingKeyword =
					obviouslyDedupedUniqueKeywords.get(indexString)
				if (!existingKeyword)
					throw new Error(
						`Expected existing keyword for ${indexString} in obviouslyDedupedUniqueKeywords`,
					)

				const newId = createDefaultId() // Generate a new id.
				const newKeyword: FinalUniqueKeyword = {
					...existingKeyword,
					id: newId,
					vector: embedding,
				}

				// Add the new keyword to the final lookup map and upsert list.
				finalKeywords.set(indexString, newKeyword)
				finalUniqueKeywordsToUpsert.push(newKeyword)
			}),
		),
	)

	console.timeEnd(`Measured embeddings and merged keywords`)

	console.timeEnd(`Measured embeddings and merged keywords`)

	// Add all deduplicated keywords that already have an id to the final lookup map
	obviouslyDedupedUniqueKeywords.forEach((keyword, key) => {
		if (keyword.id) {
			finalKeywords.set(key, keyword as FinalUniqueKeyword)
		}
	})

	// Return the final lookup map and list of keywords to upsert
	return {
		finalUniqueKeywords: finalKeywords, // A map of all unique keywords with embeddings and possible remote ids
		finalUniqueKeywordsToUpsert, // List of all unique keywords to be upserted
	}
}
