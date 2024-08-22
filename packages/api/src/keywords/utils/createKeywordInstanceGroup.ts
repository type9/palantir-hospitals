import { keywordTokenization } from "../../openai/chatFunctions/keywordTokenization"
import { WithRelatedPatientCase } from "../../patientData/schemas/patientCaseContext"
import { WithServerContext } from "../../trpc"
import { createKeywordInstance } from "./createKeywordInstance"

export const createKeywordInstanceGroup = async ({
	text,
	promptContext,
	patientCaseContext,
	ctx,
}: WithServerContext<
	WithRelatedPatientCase<{ text: string; promptContext?: string }>
>) => {
	const keywords = await keywordTokenization({ text, promptContext })
	const keywordInstanceGroupId = await ctx.db.keywordInstanceGroup
		.create({ select: { id: true } })
		.then((result) => result.id)

	if (!keywordInstanceGroupId || !keywords)
		throw new Error("Failed to create keyword instance group")

	// Create each keyword instance and await their creation
	const keywordInstancePromises = keywords.map((keyword) =>
		createKeywordInstance({
			token: keyword.semanticName,
			contextSentence: keyword.contextSentence,
			category: keyword.category,
			keywordContext: { keywordInstanceGroupId }, // Passing the group ID for relation
			patientCaseContext,
			ctx,
		}),
	)

	const keywordInstanceIds = await Promise.all(keywordInstancePromises)

	// Update the KeywordInstanceGroup with the associated keyword instances
	await ctx.db.keywordInstanceGroup.update({
		where: { id: keywordInstanceGroupId },
		data: {
			keywordInstances: {
				connect: keywordInstanceIds.map((id) => ({ id })),
			},
		},
	})

	return keywordInstanceGroupId
}
