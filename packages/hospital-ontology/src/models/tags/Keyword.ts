export type KeywordCategory =
	//context
	| "demographic"
	| "personalHistory"
	| "medicalHistory"
	| "symptom"
	//measures
	| "binaryMeasure"
	| "quantitativeMeasure"
	| "adjectiveMeasure"
	//process
	| "suspectedDiagnosis"
	| "certainDiagnosis"
	| "treatment"
	| "test"
	| "complication"
	//result
	| "outcome"

export type UniqueKeyword = {
	id: string
	/*
	 * non-unique identifier for the keyword. if semantic_name is similar and category is the same, then likely keyword should be merged
	 */
	semantic_name: string
	/*
	 * category from preset list
	 */
	category: KeywordCategory
	/*
	 * related case ids
	 */
	relatedCaseIds: string[]
}

export type Measure = {
	/*
	 * value can be a name, number or adjective. intentionally open to allow for flexibility in the type of measure
	 */
	value: string
	/*
	 * unit of measure. if not applicable, leave blank
	 */
	unit?: UniqueKeyword
}

export type KeywordInstance = {
	id: string
	/*
	 * the unique identifier of the case that this keyword instance originates from
	 */
	relatedCaseId: string
	/*
	 * reference to a unique keyword
	 */
	uniqueKeywordId: string
	/*
	 * reference to an instance of a keyword
	 */
	measure?: Measure
	/*
	 * use a portion or full component of the sentence that gives the keyword meaning in the context of the patient case
	 */
	contextSentence: string
	/*
	 * shortened descriptors that can't be measured or categorized. used to retain details that aren't easily categorized but are relevant to the context of the keyword
	 */
	note?: string
}
