import { PatientCaseData, Prisma } from "@colorchordsapp/db"
import _ from "lodash"
import pLimit from "p-limit"

import { insertUniqueKeywordWithVector } from "../../keywords/utils/insertWithVector"
import { upsertRelation } from "../../keywords/utils/upsertRelation"
import { batchTokenizePatientNote } from "../../openai/chatFunctions/batchTokenization"
import { WithServerContext, WithTransactionContext } from "../../trpc"
import { PatientNoteBatchKeywordTokenization } from "../schemas/patientNoteComponentsSchema"
import {
	extractAndMergeNewKeywordsFromTokens,
	TokenizedCase,
} from "./extractAndMergeNewKeywordsFromTokens"
import { getAllKeywordRelationshipsByKeywordMap } from "./getAllKeywordRelationshipsByKeywordMap"
import { createKeywordGroupsPromises } from "./parsedPatientPromises"
import { retryWithCooldown } from "./retryWithCooldown"

const tokenizationCooldownMs = 100
const tokenizationAttempts = 1
const tokenizationThrowErrorOnFail = false
const batchParseTransactionTimeout = 1000 * 60 * 20 // total time limit for entire batch to be completed before timing out

const limit = pLimit(20)

export const batchParsePatientCaseData = async ({
	rows,
	ctx,
}: WithServerContext<{ rows: PatientCaseData[] }>) => {
	const attemptedBatchName = `batch_${rows.map((row) => row.id).join(",")}`
	const attmptedBatchCount = rows.length

	const tokenizedCasePromises = rows.map(async (rowData) => {
		return {
			id: rowData.id,
			data: await retryWithCooldown<PatientNoteBatchKeywordTokenization>(
				async () =>
					await batchTokenizePatientNote(rowData?.patientNote ?? ""),
				tokenizationAttempts,
				tokenizationCooldownMs,
				tokenizationThrowErrorOnFail,
			),
		}
	})
	console.time(`Tokenized ${attemptedBatchName}`)
	//filter cases just incase there are any undefined data
	const tokenizedCases: TokenizedCase[] = (
		await Promise.all(tokenizedCasePromises)
	).filter((rowData) => rowData.data !== undefined) as TokenizedCase[]
	console.timeEnd(`Tokenizied ${attemptedBatchName}`)

	const batchName = `batch_${tokenizedCases.map((row) => row.id).join(",")}`
	const batchCount = tokenizedCases.length
	console.time(
		`Total BatchParse ${batchName} (${batchCount} cases, ${attmptedBatchCount} attempted)`,
	)

	try {
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
	} catch (error) {
		console.error("Error occurred:", error)
	} finally {
		await ctx.db.$disconnect()
	}
	console.timeEnd(`Total BatchParse ${batchName} (${batchCount} cases)`)
}
