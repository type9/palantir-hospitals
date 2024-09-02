import { PatientCaseData } from "@colorchordsapp/db"
import _ from "lodash"
import pLimit from "p-limit"

import { insertUniqueKeywordWithVector } from "../../keywords/utils/insertWithVector"
import { upsertRelation } from "../../keywords/utils/upsertRelation"
import { batchTokenizePatientNote } from "../../openai/chatFunctions/batchTokenization"
import { WithServerContext, WithTransactionContext } from "../../trpc"
import { extractAndMergeNewKeywordsFromTokens } from "./extractAndMergeNewKeywordsFromTokens"
import {
	getAllKeywordRelationshipsByKeywordMap,
	NewKeywordGroup,
} from "./getAllKeywordRelationshipsByKeywordMap"
import { createKeywordGroupsPromises } from "./parsedPatientPromises"
import { retryWithCooldown } from "./retryWithCooldown"

const tokenizationCooldownMs = 100
const tokenizationRetries = 5
const batchParseTransactionTimeout = 1000 * 60 * 20 // total time limit for entire batch to be completed before timing out
const cache = new Map<string, any>()

const limit = pLimit(20)

export const batchParsePatientCaseData = async ({
	rows,
	ctx,
}: WithServerContext<{ rows: PatientCaseData[] }>) => {
	const batchName = `batch_${rows.map((row) => row.id).join(",")}`
	const batchCount = rows.length

	const tokenizedCasePromises = rows.map(async (rowData) => {
		if (cache.has(batchName)) {
			console.log(`Cache hit for ${batchName}`)
			return cache.get(batchName)
		}
		return {
			id: rowData.id,
			data: await retryWithCooldown(
				async () =>
					await batchTokenizePatientNote(rowData?.patientNote ?? ""),
				tokenizationRetries,
				tokenizationCooldownMs,
			),
		}
	})

	console.time(`Total BatchParse ${batchName} (${batchCount} cases)`)

	console.time(`Tokenizing ${batchName}`)
	//filter cases just incase there are any undefined data
	const tokenizedCases = (await Promise.all(tokenizedCasePromises)).filter(
		(rowData) => rowData.data !== undefined,
	)
	console.timeEnd(`Tokenizing ${batchName}`)

	cache.set(batchName, tokenizedCases)

	await ctx.db.$transaction(
		async (tx) => {
			console.time(`Processing UniqueKeywords ${batchName}`)
			const { finalUniqueKeywords, finalUniqueKeywordsToUpsert } =
				await extractAndMergeNewKeywordsFromTokens({
					tokenizedCases,
					tx,
				})
			console.timeEnd(`Processing UniqueKeywords ${batchName}`)

			console.time(`Processing Keyword Relationships ${batchName}`)
			const { newUniqueKeywordRelations, newKeywordGroups } =
				getAllKeywordRelationshipsByKeywordMap({
					tokenizedCases,
					keywordMap: finalUniqueKeywords,
					tx,
				})
			console.timeEnd(`Processing Keyword Relationships ${batchName}`)

			const upsertUniqueKeywordsPromises =
				finalUniqueKeywordsToUpsert.map((keyword) =>
					limit(async () => {
						const vector = keyword.vector
						if (!vector) {
							throw new Error(
								"Keyword vector is missing from an upsertable keyword",
							)
						}

						console.time(
							`Upserting UniqueKeyword ${keyword.category}:${keyword.semanticName}`,
						)
						const insertReturn =
							await insertUniqueKeywordWithVector({
								data: {
									id: keyword.id,
									category: keyword.category,
									semanticName: keyword.semanticName,
									vector,
								},
								tx,
							})
						console.timeEnd(
							`Upserting UniqueKeyword ${keyword.category}:${keyword.semanticName}`,
						)

						return insertReturn
					}),
				)

			console.time(`Upserting UniqueKeywords ${batchName}`)
			await Promise.all(upsertUniqueKeywordsPromises)
			console.timeEnd(`Upserting UniqueKeywords ${batchName}`)

			const keywordGroupPromises = createKeywordGroupsPromises({
				newKeywordGroups,
				tx,
			})

			console.time(`Upserting KeywordGroups ${batchName}`)
			await Promise.all(keywordGroupPromises)
			console.timeEnd(`Upserting KeywordGroups ${batchName}`)

			const upsertUniqueKeywordRelationsPromises =
				newUniqueKeywordRelations.map((relation) =>
					limit(async () => upsertRelation({ relation, tx })),
				)

			console.time(`Upserting UniqueKeywordRelations ${batchName}`)
			await Promise.all(upsertUniqueKeywordRelationsPromises)
			console.timeEnd(`Upserting UniqueKeywordRelations ${batchName}`)
		},
		{ timeout: batchParseTransactionTimeout },
	)

	console.timeEnd(`Total BatchParse ${batchName} (${batchCount} cases)`)
}
