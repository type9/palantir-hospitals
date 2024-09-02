import { createDefaultId } from "@colorchordsapp/db"

import { KeywordTokenizationGroup } from "../../keywords/schema/tokenizedKeywordSchema"
import { getKeywordIndexString } from "../../keywords/utils/getTokenEmbeddingString"
import {
	FinalUniqueKeywordLookup,
	TokenizedCase,
} from "./extractAndMergeNewKeywordsFromTokens"
import {
	KeywordRelationLookup,
	NewKeywordGroup,
	NewKeywordInstance,
	NewUniqueKeywordRelation,
} from "./getAllKeywordRelationshipsByKeywordMap"

export const formatKeywordRelationKey = (
	fromKeywordKey: string,
	toKeywordKey: string,
) => `${fromKeywordKey}-${toKeywordKey}`

export const getNewKeywordGroups = ({
	relatedCaseId,
	keywordTokens,
	keywordLookup,
	relatedCaseRelation,
}: {
	relatedCaseId: string
	keywordTokens: KeywordTokenizationGroup
	keywordLookup: FinalUniqueKeywordLookup
	relatedCaseRelation: NewKeywordGroup["relatedCaseRelation"]
}): {
	keywordGroup: NewKeywordGroup
	keywordGroupRelations: KeywordRelationLookup
} => {
	const keywordGroupId = createDefaultId()
	const keywordInstances: NewKeywordInstance[] = []
	const keywordGroupRelations: KeywordRelationLookup = new Map()

	// In-memory structure to keep track of already processed keywords
	const keywordIdsInGroup: string[] = []

	// Iterate over each keyword token to create instances and relations
	keywordTokens.forEach((keywordToken) => {
		const keywordIndexString = getKeywordIndexString(keywordToken)
		const keyword = keywordLookup.get(keywordIndexString)

		if (!keyword) {
			throw new Error("Keyword not found in lookup")
		}

		// Create a new keyword instance
		const keywordInstance: NewKeywordInstance = {
			id: createDefaultId(),
			relatedCaseId,
			measureId: null,
			note: null,
			uniqueKeywordId: keyword.id,
			contextSentence: keywordToken.contextSentence,
			keywordGroupId,
		}

		// Add the new keyword instance to the list
		keywordInstances.push(keywordInstance)

		// Track the unique keyword IDs that have been added to the group
		keywordIdsInGroup.forEach((existingKeywordId) => {
			// Generate a unique key to represent the relation
			const relationKey = formatKeywordRelationKey(
				existingKeywordId,
				keyword.id,
			)
			const reversedRelationKey = formatKeywordRelationKey(
				keyword.id,
				existingKeywordId,
			)

			// Check if this relation already exists in the lookup with also checking the reversed key
			const existingRelation =
				keywordGroupRelations.get(relationKey) ||
				keywordGroupRelations.get(reversedRelationKey)

			//if it exists, we return because we are only counting the first instance of a relation
			if (existingRelation) return

			// If it does not exist, create a new relation
			const newRelation: NewUniqueKeywordRelation = {
				fromKeywordId: existingKeywordId,
				toKeywordId: keyword.id,
				relationType: "cooccurrence",
				keywordGroupOccurrences: [keywordGroupId],
				parsedCaseOccurrences: [],
			}

			keywordGroupRelations.set(relationKey, newRelation)
		})

		// After processing, add the current keyword ID to the group tracker
		keywordIdsInGroup.push(keyword.id)
	})

	const keywordGroup: NewKeywordGroup = {
		id: keywordGroupId,
		relatedCaseId,
		relatedCaseRelation,
		keywordInstances,
	}

	return { keywordGroup, keywordGroupRelations }
}

const aggregateKeywordGroupRelations = ({
	relatedCaseId,
	relations,
	keywordLookup,
}: {
	relatedCaseId: string
	relations: KeywordRelationLookup[]
	keywordLookup: FinalUniqueKeywordLookup
}): NewUniqueKeywordRelation[] => {
	// Use a map to aggregate relations and handle duplicates
	const aggregatedRelations: Map<string, NewUniqueKeywordRelation> = new Map()

	// Iterate through each KeywordRelationLookup to process relations
	relations.forEach((relationLookup) => {
		relationLookup.forEach((relation, relationKey) => {
			const reverseRelationKey = formatKeywordRelationKey(
				relation.toKeywordId,
				relation.fromKeywordId,
			)

			// Check if the relation or its reverse already exists
			if (aggregatedRelations.has(relationKey)) {
				// Merge with existing relation
				const existingRelation = aggregatedRelations.get(relationKey)!
				existingRelation.keywordGroupOccurrences.push(
					...relation.keywordGroupOccurrences,
				)
			} else if (aggregatedRelations.has(reverseRelationKey)) {
				// Merge with the reverse relation
				const existingReverseRelation =
					aggregatedRelations.get(reverseRelationKey)!
				existingReverseRelation.keywordGroupOccurrences.push(
					...relation.keywordGroupOccurrences,
				)
			} else {
				// If no existing relation found, add the new relation
				aggregatedRelations.set(relationKey, {
					...relation,
					parsedCaseOccurrences: [relatedCaseId], // Set parsedCaseOccurrences to include the related case
				})
			}
		})
	})

	// Prepare final list of unique relations and their reverse relations
	const finalRelations: NewUniqueKeywordRelation[] = []

	aggregatedRelations.forEach((relation, relationKey) => {
		// Add the original relation
		finalRelations.push(relation)

		// Create and add the reverse relation
		const reverseRelation: NewUniqueKeywordRelation = {
			fromKeywordId: relation.toKeywordId,
			toKeywordId: relation.fromKeywordId,
			relationType: relation.relationType, // Same relation type as original
			keywordGroupOccurrences: [...relation.keywordGroupOccurrences], // Same occurrences as original
			parsedCaseOccurrences: [...relation.parsedCaseOccurrences], // Same parsed cases as original
		}

		finalRelations.push(reverseRelation)
	})

	return finalRelations
}

export const getKeywordGroupsAndRelationsFromCaseTokens = ({
	tokenizedCase,
	keywordLookup,
}: {
	tokenizedCase: TokenizedCase
	keywordLookup: FinalUniqueKeywordLookup
}) => {
	const keywordGroups: NewKeywordGroup[] = []
	const runningKeywordRelations: KeywordRelationLookup[] = []

	// Iterate over each keyword group to create instances and relations
	const caseResultData = getNewKeywordGroups({
		keywordTokens: tokenizedCase.data.result,
		keywordLookup,
		relatedCaseRelation: "caseResult",
		relatedCaseId: tokenizedCase.id,
	})
	keywordGroups.push(caseResultData.keywordGroup)
	runningKeywordRelations.push(caseResultData.keywordGroupRelations)

	const caseProceduresData = tokenizedCase.data.procedures.map((procedure) =>
		getNewKeywordGroups({
			keywordTokens: procedure,
			keywordLookup,
			relatedCaseRelation: "caseProcedure",
			relatedCaseId: tokenizedCase.id,
		}),
	)
	caseProceduresData.forEach((procedureData) => {
		keywordGroups.push(procedureData.keywordGroup)
		runningKeywordRelations.push(procedureData.keywordGroupRelations)
	})

	const caseContextData = getNewKeywordGroups({
		keywordTokens: tokenizedCase.data.context,
		keywordLookup,
		relatedCaseRelation: "patientContext",
		relatedCaseId: tokenizedCase.id,
	})
	keywordGroups.push(caseContextData.keywordGroup)
	runningKeywordRelations.push(caseContextData.keywordGroupRelations)

	const keywordRelations = aggregateKeywordGroupRelations({
		relatedCaseId: tokenizedCase.id,
		relations: runningKeywordRelations,
		keywordLookup,
	})

	return { keywordGroups, keywordRelations }
}
