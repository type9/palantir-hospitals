import { z } from "zod"

// Enum for KeywordCategory
const KeywordCategory = z.enum([
	"demographic",
	"personalHistory",
	"medicalHistory",
	"symptom",
	"binaryMeasure",
	"quantitativeMeasure",
	"adjectiveMeasure",
	"suspectedDiagnosis",
	"certainDiagnosis",
	"treatment",
	"test",
	"complication",
	"outcome",
])

// Schema for UniqueKeyword
const UniqueKeywordSchema = z.object({
	id: z.string(),
	semantic_name: z.string(),
	category: KeywordCategory,
	relatedCaseIds: z.array(z.string()),
})

// Schema for Measure
const MeasureSchema = z.object({
	value: z.string(),
	unit: UniqueKeywordSchema.optional(),
})

// Schema for KeywordInstance
const KeywordInstanceSchema = z.object({
	id: z.string(),
	relatedCaseId: z.string(),
	uniqueKeywordId: z.string(),
	measure: MeasureSchema.optional(),
	contextSentence: z.string(),
	note: z.string().optional(),
})

// Exporting schemas
export {
	KeywordCategory,
	UniqueKeywordSchema,
	MeasureSchema,
	KeywordInstanceSchema,
}
