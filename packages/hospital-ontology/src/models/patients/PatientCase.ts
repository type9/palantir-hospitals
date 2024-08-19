import { KeywordInstance } from "../tags/keyword"

export type PatientContext = {
	/*
	 * Demographic information about the patient. Should be easily categorizable data such as age, race, location, etc.
	 */
	demographics: KeywordInstance[]
	/*
	 * Medical or Personal history that has been noted. Should be easily categorizable data such as previous conditions, surgeries, vaccines etc. Personal history can include what happened to the patient before they arrived. Details about the patient's life that may be relevant to their current condition.
	 */
	history: KeywordInstance[]
	notes?: string
}

export type CaseProcedure = {
	/*
	 * Why an action was taken. Can be diagnosis or prior information that led to the action
	 */
	reason: KeywordInstance[]
	/*
	 * What the method was of said action
	 */
	method: KeywordInstance[]
	/*
	 * Result or analysis following the action
	 */
	result: KeywordInstance[]
	/*
	 * Additional details that might be relevant to the procedure that cannot be categorized in above structure
	 */
	notes?: string
}

export type CaseResult = {
	/*
	 * summarized key takeaways from the case
	 */
	summary: KeywordInstance[]
	/*
	 * Additional details that cannot be categorized in above structure
	 */
	notes?: string
}

export type PatientCase = {
	/*
	 * Information that happened prior to care
	 */
	patientContext: PatientContext
	/*
	 * A list of procedures taken on the patient
	 */
	procedures: CaseProcedure[]
	/*
	 * The result of the case
	 */
	caseResult: CaseResult
}
