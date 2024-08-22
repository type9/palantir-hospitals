import { KeywordInstanceGroup } from "@colorchordsapp/db"

import { WithRelatedPatientCase } from "../../patientData/schemas/patientCaseContext"

export type KeywordContext = {
	keywordInstanceGroupId: KeywordInstanceGroup["id"]
}

export type WithKeywordContext<T> = WithRelatedPatientCase<T> & {
	keywordContext: KeywordContext
}
