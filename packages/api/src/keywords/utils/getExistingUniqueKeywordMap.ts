import { KeywordCategory, Prisma } from "@colorchordsapp/db"

import { WithTransactionContext } from "../../trpc"
import { getKeywordIndexString } from "./getTokenEmbeddingString"

export const getExistingUniqueKeywordMap = async ({
	keywordLookupMap,
	tx,
}: WithTransactionContext<{
	keywordLookupMap: Map<
		string,
		{ semanticName: string; category: KeywordCategory; id?: string }
	>
}>) => {
	// Extract unique keys from the lookup map
	const uniqueKeys = Array.from(keywordLookupMap.values())

	// needs to use queryRaw because Prisma does not support IN with multiple columns
	const existingKeywords = await tx.$queryRaw<
		Array<{
			id: string
			semanticName: string
			category: string
			vector: number[]
		}>
	>(
		Prisma.sql`SELECT id, "semanticName", "category"
  FROM "UniqueKeyword"
  WHERE ("semanticName", "category"::"KeywordCategory") IN (${Prisma.join(
		uniqueKeys.map(
			(key) =>
				Prisma.sql`(${key.semanticName}, ${Prisma.raw(
					`'${key.category}'::"KeywordCategory"`,
				)})`,
		),
  )})`,
	)

	// Assign remote IDs to existing keywords in the lookup map
	existingKeywords.forEach((keyword) => {
		const key = getKeywordIndexString({
			semanticName: keyword.semanticName,
			category: keyword.category,
		})

		const existingEntry = keywordLookupMap.get(key)

		if (
			existingEntry &&
			existingEntry.semanticName &&
			existingEntry.category
		) {
			// Assign the remote ID to the keyword in the lookup map
			keywordLookupMap.set(key, {
				...existingEntry,
				id: keyword.id, // Add the remote ID
			})
		}
	})

	// Return the updated lookup map
	return keywordLookupMap
}
