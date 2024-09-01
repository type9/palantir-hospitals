import { WithTransactionContext } from "../../trpc"

type Relation = {
	fromKeywordId: string
	toKeywordId: string
	relationType: string
	keywordGroupOccurences: string[]
	parsedCaseOccurences: string[]
}

export const upsertRelation = async ({
	relation,
	tx,
}: WithTransactionContext<{ relation: Relation }>) => {
	return await tx.$executeRaw`
    INSERT INTO "RelatedKeywords" ("fromKeywordId", "toKeywordId", "relationType", "keywordGroupOccurences", "parsedCaseOccurences")
    VALUES (${relation.fromKeywordId}, ${relation.toKeywordId}, ${relation.relationType}, ${relation.keywordGroupOccurences}, ${relation.parsedCaseOccurences})
    ON CONFLICT ("fromKeywordId", "toKeywordId")
    DO UPDATE SET 
      "relationType" = EXCLUDED."relationType",
      "keywordGroupOccurences" = array(SELECT DISTINCT unnest("RelatedKeywords"."keywordGroupOccurences" || EXCLUDED."keywordGroupOccurences")),
      "parsedCaseOccurences" = array(SELECT DISTINCT unnest("RelatedKeywords"."parsedCaseOccurences" || EXCLUDED."parsedCaseOccurences"));
  `
}
