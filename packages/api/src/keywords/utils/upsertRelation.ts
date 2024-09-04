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
	// Step 1: Sort keywords to maintain a consistent ordering
	const [fromKeywordId, toKeywordId] = sortKeywords(
		relation.fromKeywordId,
		relation.toKeywordId,
	)

	// Step 2: Upsert the RelatedKeywords entry and get its ID
	const result = await tx.$queryRaw<{ id: string }[]>`
    INSERT INTO "RelatedKeywords" 
    ("id", "fromKeywordId", "toKeywordId", "relationType")
    VALUES (
      gen_random_uuid(),
      ${fromKeywordId}, 
      ${toKeywordId}, 
      ${relation.relationType}::"KeywordRelation"
    )
    ON CONFLICT ("fromKeywordId", "toKeywordId", "relationType")
    DO UPDATE SET 
      "relationType" = EXCLUDED."relationType"
    RETURNING "id";
  `

	// Get the ID of the existing or newly inserted RelatedKeywords entry
	const relatedKeywordID = result?.[0]?.id

	if (!relatedKeywordID)
		throw new Error(
			`Failed to get relatedKeywordID for relationConstraint ${relation.fromKeywordId}- [${relation.relationType}] -> ${relation.toKeywordId}`,
		)

	// Step 3: Bulk insert or ignore occurrences for KeywordGroup
	if (relation.keywordGroupOccurrences.length > 0) {
		await tx.$executeRaw`
      INSERT INTO "RelatedKeywordGroupOccurrences"
      ("id", "relatedKeywordsId", "keywordInstanceGroupId")
      SELECT 
        gen_random_uuid(),
        ${relatedKeywordID},
        unnest(ARRAY[${Prisma.join(relation.keywordGroupOccurrences)}]::text[])
      ON CONFLICT ("relatedKeywordsId", "keywordInstanceGroupId")
      DO NOTHING;
    `
	}

	// Step 4: Bulk insert or ignore occurrences for ParsedCase
	if (relation.parsedCaseOccurrences.length > 0) {
		await tx.$executeRaw`
      INSERT INTO "RelatedKeywordCaseOccurrences"
      ("id", "relatedKeywordsId", "parsedPatientCaseId")
      SELECT 
        gen_random_uuid(),
        ${relatedKeywordID},
        unnest(ARRAY[${Prisma.join(relation.parsedCaseOccurrences)}]::text[])
      ON CONFLICT ("relatedKeywordsId", "parsedPatientCaseId")
      DO NOTHING;
    `
	}
}
