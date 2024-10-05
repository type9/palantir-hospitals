// import { WithRelatedPatientCase } from "../../patientData/schemas/patientCaseContext"
// import { KeywordTokenizationGroup } from "../schema/tokenizedKeywordSchema"
// import { createKeywordInstance } from "./createKeywordInstance"

// export const createKeywordInstanceGroup = async ({
// 	keywords,
// 	patientCaseContext,
// 	tx,
// }: WithRelatedPatientCase<{ keywords: KeywordTokenizationGroup }>) => {
// 	const keywordInstanceGroupId = await tx.keywordInstanceGroup
// 		.create({ data: {}, select: { id: true } })
// 		.then((result) => result.id)

// 	if (!keywordInstanceGroupId || !keywords)
// 		throw new Error("Failed to create keyword instance group")

// 	// Create each keyword instance and await their creation
// 	const keywordInstancePromises = keywords.map((keyword) =>
// 		createKeywordInstance({
// 			token: keyword.semanticName,
// 			contextSentence: keyword.contextSentence,
// 			category: keyword.category,
// 			keywordContext: { keywordInstanceGroupId }, // Passing the group ID for relation
// 			patientCaseContext,
// 			tx,
// 		}),
// 	)

// 	const keywordInstanceIds = await Promise.all(keywordInstancePromises)

// 	// Update the KeywordInstanceGroup with the associated keyword instances
// 	await tx.keywordInstanceGroup.update({
// 		where: { id: keywordInstanceGroupId },
// 		data: {
// 			keywordInstances: {
// 				connect: keywordInstanceIds.map((id) => ({ id })),
// 			},
// 		},
// 	})

// 	return keywordInstanceGroupId
// }
