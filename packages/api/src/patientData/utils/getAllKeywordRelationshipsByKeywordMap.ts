import { KeywordInstance, RelatedKeywords } from "@colorchordsapp/db/zod"

import { WithTransactionContext } from "../../trpc"
import {
	FinalUniqueKeywordLookup,
	TokenizedCase,
} from "./extractAndMergeNewKeywordsFromTokens"
import { getKeywordGroupsAndRelationsFromCaseTokens } from "./getKeywordGroupAndRelationsFromCaseTokens"

export type NewKeywordInstance = KeywordInstance

export type NewUniqueKeywordRelation = {
	fromKeywordId: string
	toKeywordId: string
	relationType: RelatedKeywords["relationType"]
	keywordGroupOccurences: string[]
	parsedCaseOccurences: string[]
}

export type NewKeywordGroup = {
	id: string
	relatedCaseId: string
	relatedCaseRelation: "patientContext" | "caseProcedure" | "caseResult"
	keywordInstances: NewKeywordInstance[]
}

export type ExtractedKeywordsAndRelations = {
	newKeywordGroups: NewKeywordGroup[]
	newUniqueKeywordRelations: NewUniqueKeywordRelation[]
}

export type KeywordRelationLookup = Map<string, NewUniqueKeywordRelation>

export const getAllKeywordRelationshipsByKeywordMap = ({
	tokenizedCases,
	keywordMap,
	tx,
}: WithTransactionContext<{
	tokenizedCases: TokenizedCase[]
	keywordMap: FinalUniqueKeywordLookup
}>) => {
	const finalKeywordGroups: NewKeywordGroup[] = []
	const keywordRelations: NewUniqueKeywordRelation[] = []

	tokenizedCases.forEach((tokenizedCase) => {
		const keywordData = getKeywordGroupsAndRelationsFromCaseTokens({
			tokenizedCase,
			keywordLookup: keywordMap,
		})
		finalKeywordGroups.push(...keywordData.keywordGroups)
		keywordRelations.push(...keywordData.keywordRelations)
	})

	return {
		newKeywordGroups: finalKeywordGroups,
		newUniqueKeywordRelations: keywordRelations,
	}
}
