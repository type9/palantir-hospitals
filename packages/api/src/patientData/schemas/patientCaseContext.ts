import { PatientCaseData } from "@colorchordsapp/db/zod"

export type RelatedPatientCaseContext = {
	relatedCaseId: PatientCaseData["id"]
}

export type WithRelatedPatientCase<T> = T & {
	patientCaseContext: RelatedPatientCaseContext
}
