import { tokenizeCaseSearchPrompt } from "../../openai/chatFunctions/tokenizeCaseSearchPrompt"
import { retryWithCooldown } from "../../patientData/utils/retryWithCooldown"
import { publicProcedure } from "../../trpc"
import { GetRelatedCasesSchema } from "../schema/getRelatedCasesSchema"

// Function that triggers the patient data parse
export const caseSearchByPrompt = publicProcedure
	.input(GetRelatedCasesSchema)
	.query(async ({ input, ctx }) => {
		const tokenizedPrompt = await retryWithCooldown(
			() => tokenizeCaseSearchPrompt(input.prompt),
			3,
			300,
		)

		console.log(tokenizedPrompt)

		return tokenizedPrompt
	})
