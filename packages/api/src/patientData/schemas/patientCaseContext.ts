import {
	ParsedPatientCaseRelations,
	PatientCaseData,
} from "@colorchordsapp/db/zod"

export type KeywordGroupToPatientCaseRelation = keyof Omit<
	ParsedPatientCaseRelations,
	"patientCaseData"
>
export type RelatedPatientCaseContext = {
	relatedCaseId: PatientCaseData["id"]
}

export type WithRelatedPatientCase<T> = T & {
	patientCaseContext: RelatedPatientCaseContext
}
