import { WithTransactionContext } from "../../trpc"
import { NewKeywordGroup } from "./getAllKeywordRelationshipsByKeywordMap"

export const createKeywordGroupsPromises = ({
	newKeywordGroups,
	tx,
}: WithTransactionContext<{ newKeywordGroups: NewKeywordGroup[] }>) =>
	newKeywordGroups.map((group) => {
		// Create or connect the ParsedPatientCase first
		const parsedPatientCaseData = tx.parsedPatientCase.upsert({
			where: { id: group.relatedCaseId },
			update: {},
			create: {
				id: group.relatedCaseId,
				patientCaseData: {
					connect: { id: group.relatedCaseId },
				},
			},
		})

		// Determine the specific relation fields for KeywordInstanceGroup based on relatedCaseRelation
		const relationData =
			group.relatedCaseRelation === "patientContext"
				? {
						patientContext: {
							connect: { id: group.relatedCaseId },
						},
					}
				: group.relatedCaseRelation === "caseProcedure"
					? {
							caseProcedures: {
								connect: { id: group.relatedCaseId },
							},
						}
					: group.relatedCaseRelation === "caseResult"
						? {
								caseResult: {
									connect: { id: group.relatedCaseId },
								},
							}
						: {}

		// Create the KeywordInstanceGroup with the correct connections
		const createKeywordGroupPromise = tx.keywordInstanceGroup.create({
			data: {
				id: group.id,
				keywordInstances: {
					create: group.keywordInstances.map((instance) => ({
						id: instance.id,
						relatedCaseId: instance.relatedCaseId,
						measureId: instance.measureId,
						note: instance.note,
						uniqueKeywordId: instance.uniqueKeywordId,
						contextSentence: instance.contextSentence,
						keywordGroupId: instance.keywordGroupId,
					})),
				},
				...relationData, // Merge the dynamic data for different relations
			},
		})

		return Promise.all([parsedPatientCaseData, createKeywordGroupPromise])
	})
