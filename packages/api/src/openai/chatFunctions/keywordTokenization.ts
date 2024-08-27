import { KeywordCategory } from "@colorchordsapp/db"

import { openai } from ".."
import {
	KeywordTokenizationGroup,
	KeywordTokenizationGroupResponseJSONSchema,
	KeywordTokenizationGroupResponseSchema,
} from "../../keywords/schema/tokenizedKeywordSchema"

const MODEL = "gpt-4o-mini"
const SYSTEM_MESSAGE = "You are a systematic medical keyword identifier"
const KEYWORK_CATEGORIES_LIST = Object.values(KeywordCategory).join("\n")
const getUserMessage = (promptContext?: string): string => {
	return `You are being given a slice of medical notes from a healthcare provider of a single patient. The context of this note is ${promptContext ?? "unknown"}.
    I would like you to identify medical keywords in the text, give it a semantic name which can have multiple tokens separated by a space, and categorize them into the given categories:\n
    ${KEYWORK_CATEGORIES_LIST}

    \nalso extract a snippet of a partial or whole sentence that gives the keyword meaning in the context of the patient case.
    `
}

export const keywordTokenization = async ({
	text,
	promptContext,
}: {
	text: string
	promptContext?: string
}): Promise<KeywordTokenizationGroup> => {
	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{ role: "system", content: SYSTEM_MESSAGE },
			{
				role: "user",
				content: `${getUserMessage(promptContext)}\n\nPatientNotes Slice:\n${text}`,
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				schema: KeywordTokenizationGroupResponseJSONSchema,
				name: "KeywordTokenizationGroupResponseSchema",
			},
		},
	})

	// Extract the function call result from the response
	const result = response.choices[0]?.message?.content

	if (result) {
		const functionResult = KeywordTokenizationGroupResponseSchema.parse(
			JSON.parse(result),
		)
		return functionResult.keywords
	}

	throw new Error("Failed to tokenize keywords")
}
