import { z } from "zod"

import { KeywordInstanceSchema } from "./keyword" // Assuming you have the KeywordInstanceSchema defined as shown previously

// Schema for PatientContext
const PatientContextSchema = z.object({
	demographic: z.array(KeywordInstanceSchema),
	history: z.array(KeywordInstanceSchema),
	notes: z.string().optional(),
})

// Schema for CaseProcedure
const CaseProcedureSchema = z.object({
	reason: z.array(KeywordInstanceSchema),
	method: z.array(KeywordInstanceSchema),
	result: z.array(KeywordInstanceSchema),
	notes: z.string().optional(),
})

// Schema for CaseResult
const CaseResultSchema = z.object({
	summary: z.array(KeywordInstanceSchema),
	notes: z.string().optional(),
})

// Schema for PatientCase
const PatientCaseSchema = z.object({
	patientContext: PatientContextSchema,
	procedures: z.array(CaseProcedureSchema),
	caseResult: CaseResultSchema,
})

// Exporting schemas
export {
	PatientContextSchema,
	CaseProcedureSchema,
	CaseResultSchema,
	PatientCaseSchema,
}
