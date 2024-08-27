import { db } from "@colorchordsapp/db"
import {
	ParsedPatientCaseRelations,
	PatientCaseData,
} from "@colorchordsapp/db/zod"

// Extract the type of the transaction client from the db.$transaction method
type TransactionContext = Parameters<typeof db.$transaction>[0] extends (
	tx: infer T,
) => any
	? T
	: never

export type KeywordGroupToPatientCaseRelation = keyof Omit<
	ParsedPatientCaseRelations,
	"patientCaseData"
>
export type RelatedPatientCaseContext = {
	relatedCaseId: PatientCaseData["id"]
}

export type WithRelatedPatientCase<T> = T & {
	patientCaseContext: RelatedPatientCaseContext
	tx: TransactionContext
}
