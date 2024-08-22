import {
	KeywordCategorySchema,
	UniqueKeywordSchema,
} from "@colorchordsapp/db/zod"
import { z } from "zod"

export const KeywordTokenizationSchema = z.object({
	semanticName: z.string(),
	category: KeywordCategorySchema,
	contextSentence: z.string(),
})

export const KeywordTokenizationGroupSchema = z.array(KeywordTokenizationSchema)

export type KeywordTokenizationGroup = z.infer<
	typeof KeywordTokenizationGroupSchema
>
