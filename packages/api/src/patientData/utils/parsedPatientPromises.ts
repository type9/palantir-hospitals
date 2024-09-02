import pLimit from "p-limit"

import { WithTransactionContext } from "../../trpc"
import { NewKeywordGroup } from "./getAllKeywordRelationshipsByKeywordMap"

const limit = pLimit(20)

export const createKeywordGroupsPromises = ({
	newKeywordGroups,
	tx,
}: WithTransactionContext<{ newKeywordGroups: NewKeywordGroup[] }>) =>
	newKeywordGroups.map((group) =>
		limit(async () => {
			console.time(
				`Upserted connection to PatientCase for ${group.relatedCaseId} to groupId ${group.id}`,
			)

			const parsedPatientCaseData = tx.parsedPatientCase.upsert({
				where: { id: group.relatedCaseId },
				update: {},
				create: {
					id: group.relatedCaseId,
					patientCaseData: {
						connect: { id: group.relatedCaseId }, // Correct connection by foreign key
					},
				},
			})

			console.timeEnd(
				`Upserted connection to PatientCase for ${group.relatedCaseId} to groupId ${group.id}`,
			)

			console.time(
				`Updated parsedAt field for PatientCaseData with id ${group.relatedCaseId}`,
			)

			const updateParsedAtPromise = tx.patientCaseData.update({
				where: { id: group.relatedCaseId },
				data: {
					parsedAt: new Date(), // Update the parsedAt field to the current date and time
				},
			})

			console.timeEnd(
				`Updated parsedAt field for PatientCaseData with id ${group.relatedCaseId}`,
			)

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

			console.time(
				`Created KeywordGroup for ${group.relatedCaseId} to groupId ${group.id}`,
			)

			// Create the KeywordInstanceGroup with the correct connections
			const createKeywordGroupPromise = tx.keywordInstanceGroup.create({
				data: {
					id: group.id,
					keywordInstances: {
						create: group.keywordInstances.map(
							({ keywordGroupId, ...instance }) => ({
								...instance, // Spread all properties except keywordGroupId
							}),
						),
					},
					...relationData, // Merge the dynamic data for different relations
				},
			})

			console.timeEnd(
				`Created KeywordGroup for ${group.relatedCaseId} to groupId ${group.id}`,
			)

			return Promise.all([
				parsedPatientCaseData,
				createKeywordGroupPromise,
				updateParsedAtPromise,
			])
		}),
	)
