import { WithTransactionContext } from "../../trpc"

type Relation = {
	fromKeywordId: string
	toKeywordId: string
	relationType: string
	keywordGroupOccurrences: string[]
	parsedCaseOccurrences: string[]
}

export const upsertRelation = async ({
	relation,
	tx,
}: WithTransactionContext<{ relation: Relation }>) => {
	return await tx.$executeRaw`
    INSERT INTO "RelatedKeywords" ("fromKeywordId", "toKeywordId", "relationType", "keywordGroupOccurrences", "parsedCaseOccurrences")
    VALUES (${relation.fromKeywordId}, ${relation.toKeywordId}, ${relation.relationType}, ${relation.keywordGroupOccurrences}, ${relation.parsedCaseOccurrences})
    ON CONFLICT ("fromKeywordId", "toKeywordId")
    DO UPDATE SET 
      "relationType" = EXCLUDED."relationType",
      "keywordGroupOccurences" = array(SELECT DISTINCT unnest("RelatedKeywords"."keywordGroupOccurences" || EXCLUDED."keywordGroupOccurences")),
      "parsedCaseOccurences" = array(SELECT DISTINCT unnest("RelatedKeywords"."parsedCaseOccurences" || EXCLUDED."parsedCaseOccurences"));
  `
}
