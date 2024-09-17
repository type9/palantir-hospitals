import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"

import { KeywordTokenizationGroupSchema } from "./tokenizedKeywordSchema"

export const TokenizedCaseSearchPromptSchema = z.object({
	context: KeywordTokenizationGroupSchema.describe(
		"Array of keywords that describe the context and background of the patient's condition before the medical procedures.",
	),
	procedures: KeywordTokenizationGroupSchema.describe(
		"Array of keyword arrays that describe the medical procedures that were attempted during the patient's care. Also can include additional diagnosis or discoveries made as a result of the procedure. Each array represents an attempted procedure",
	),
	result: KeywordTokenizationGroupSchema.describe(
		"Array of keywords that describe the outcomes or results",
	),
})

export type TokenizedCaseSearchPrompt = z.infer<
	typeof TokenizedCaseSearchPromptSchema
>
export const TokenizedCaseSearchPromptJSONSchema = zodToJsonSchema(
	TokenizedCaseSearchPromptSchema,
	{
		name: "responseRoot",
	},
)?.definitions?.responseRoot as Record<string, unknown>
