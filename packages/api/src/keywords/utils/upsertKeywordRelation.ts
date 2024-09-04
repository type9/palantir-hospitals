import { Prisma } from "@colorchordsapp/db"

import { NewUniqueKeywordRelation } from "../../patientData/utils/getAllKeywordRelationshipsByKeywordMap"
import { WithTransactionContext } from "../../trpc"

export const sortKeywords = (
	keyword1: string,
	keyword2: string,
): [string, string] => {
	return keyword1 < keyword2 ? [keyword1, keyword2] : [keyword2, keyword1]
}

export const upsertKeywordRelation = async ({
	relation,
	tx,
}: WithTransactionContext<{ relation: NewUniqueKeywordRelation }>) => {
	// Step 1: Sort keywords to maintain a consistent ordering
	const [fromKeywordId, toKeywordId] = sortKeywords(
		relation.fromKeywordId,
		relation.toKeywordId,
	)

	console.time(
		`Upserted relation ${fromKeywordId} -[${relation.relationType}]-> ${toKeywordId}`,
	)

	// Step 2: Combine operations in a single query using multiple CTEs
	const result = await tx.$queryRaw<{ id: string }[]>`
    WITH upsert_related_keywords AS (
      INSERT INTO "RelatedKeywords" 
      ("id", "fromKeywordId", "toKeywordId", "relationType")
      VALUES (
        gen_random_uuid(),
        ${Prisma.sql`${fromKeywordId}`}, 
        ${Prisma.sql`${toKeywordId}`}, 
        ${Prisma.sql`${relation.relationType}`}::"KeywordRelation"
      )
      ON CONFLICT ("fromKeywordId", "toKeywordId", "relationType")
      DO UPDATE SET 
        "relationType" = EXCLUDED."relationType"
      RETURNING "id"
    ),
    insert_group_occurrences AS (
      INSERT INTO "RelatedKeywordGroupOccurrences"
      ("id", "relatedKeywordsId", "keywordInstanceGroupId")
      SELECT 
        gen_random_uuid(),
        (SELECT id FROM upsert_related_keywords),
        unnest(ARRAY[${Prisma.join(relation.keywordGroupOccurrences.map((occ) => Prisma.sql`${occ}`))}]::text[])
      ON CONFLICT ("relatedKeywordsId", "keywordInstanceGroupId")
      DO NOTHING
      RETURNING "relatedKeywordsId"
    )
    INSERT INTO "RelatedKeywordCaseOccurrences"
    ("id", "relatedKeywordsId", "parsedPatientCaseId")
    SELECT 
      gen_random_uuid(),
      (SELECT id FROM upsert_related_keywords),
      unnest(ARRAY[${Prisma.join(relation.parsedCaseOccurrences.map((occ) => Prisma.sql`${occ}`))}]::text[])
    ON CONFLICT ("relatedKeywordsId", "parsedPatientCaseId")
    DO NOTHING
    RETURNING "relatedKeywordsId";
  `

	console.timeEnd(
		`Upserted relation ${fromKeywordId} -[${relation.relationType}]-> ${toKeywordId}`,
	)
}
