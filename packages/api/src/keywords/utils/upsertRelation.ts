import { createDefaultId, Prisma } from "@colorchordsapp/db"

import { WithTransactionContext } from "../../trpc"

type Relation = {
	fromKeywordId: string
	toKeywordId: string
	relationType: string
	keywordGroupOccurrences: string[]
	parsedCaseOccurrences: string[]
}

export const sortKeywords = (
	keyword1: string,
	keyword2: string,
): [string, string] => {
	return keyword1 < keyword2 ? [keyword1, keyword2] : [keyword2, keyword1]
}

export const upsertRelation = async ({
	relation,
	tx,
}: WithTransactionContext<{ relation: Relation }>) => {
	const [fromKeywordId, toKeywordId] = sortKeywords(
		relation.fromKeywordId,
		relation.toKeywordId,
	)

	const newRelatedKeywordID = createDefaultId()

	// Upsert into the RelatedKeywords table
	const relatedKeywordsResult = await tx.$queryRaw<{ id: string }[]>`
    INSERT INTO "RelatedKeywords" 
    ("id","fromKeywordId", "toKeywordId", "relationType")
    VALUES (
      ${newRelatedKeywordID},
      ${fromKeywordId}, 
      ${toKeywordId}, 
      ${relation.relationType}::"KeywordRelation"
    )
    ON CONFLICT ("fromKeywordId", "toKeywordId", "relationType")
    DO UPDATE SET 
      "relationType" = EXCLUDED."relationType"
    RETURNING id;
  `

	// Extract the id correctly from the result
	const relatedKeywordId = relatedKeywordsResult[0]?.id

	// Check if the returned ID is valid
	if (!relatedKeywordId) {
		throw new Error("Failed to retrieve the relatedKeywordId")
	}

	// Update or insert RelatedKeywordGroupOccurrences
	if (relation.keywordGroupOccurrences.length > 0) {
		await tx.$executeRaw`
      INSERT INTO "RelatedKeywordGroupOccurrences"
      ("id", "relatedKeywordsId", "keywordInstanceGroupId")
      SELECT gen_random_uuid(), ${relatedKeywordId}, unnest(ARRAY[${Prisma.join(relation.keywordGroupOccurrences)}]::text[])
      ON CONFLICT ("relatedKeywordsId", "keywordInstanceGroupId")
      DO NOTHING;
    `
	}

	// Update or insert RelatedKeywordCaseOccurrences
	if (relation.parsedCaseOccurrences.length > 0) {
		await tx.$executeRaw`
      INSERT INTO "RelatedKeywordCaseOccurrences"
      ("id", "relatedKeywordsId", "parsedPatientCaseId")
      SELECT gen_random_uuid(), ${relatedKeywordId}, unnest(ARRAY[${Prisma.join(relation.parsedCaseOccurrences)}]::text[])
      ON CONFLICT ("relatedKeywordsId", "parsedPatientCaseId")
      DO NOTHING;
    `
	}
}
