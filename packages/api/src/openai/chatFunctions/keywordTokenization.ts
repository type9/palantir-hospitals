import { KeywordCategory } from "@colorchordsapp/db"

import { openai } from ".."
import {
	KeywordTokenizationGroup,
	KeywordTokenizationGroupSchema,
} from "../../keywords/schema/tokenizedKeywordSchema"

const TOKENIZE_FUNCTION_CALL = "keyword_tokenization"
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
				content: `${getUserMessage(promptContext)}\n\nPatientNotes Slice: ${text}`,
			},
		],
		functions: [
			{
				name: TOKENIZE_FUNCTION_CALL,
				description:
					"Identifies medical keywords in the text, gives them a semantic name, and categorizes them.",
				parameters: {
					type: "object",
					properties: {
						keywords: {
							type: "array",
							items: {
								type: "object",
								properties: {
									semanticName: {
										type: "string",
										description:
											"The name of the keyword to identify for similarities later. Can have a minimal number of tokens separated by a space.",
									},
									category: {
										type: "string",
										description: `A category from the preset list:\n${KEYWORK_CATEGORIES_LIST}`,
									},
									contextSentence: {
										type: "string",
										description: `A portion or full component of the sentence that gives the keyword meaning in the context of the patient case.`,
									},
								},
								required: [
									"semanticName",
									"category",
									"contextSentence",
								],
							},
						},
					},
					required: ["keywords"],
				},
			},
		],
		function_call: {
			name: TOKENIZE_FUNCTION_CALL,
		},
	})

	// Extract the function call result from the response
	const result = response.choices[0]?.message?.tool_calls?.find(
		(call) => call.id === "keyword_tokenziation",
	)?.function.arguments
	if (result) {
		const functionResult = KeywordTokenizationGroupSchema.parse(result)
		return functionResult
	}

	throw new Error("Failed to tokenize keywords")
}
