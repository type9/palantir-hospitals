import { openai } from ".."
import {
	PatientNoteBatchKeywordTokenization,
	PatientNoteBatchKeywordTokenizationResponseJSONSchema,
	PatientNoteBatchKeywordTokenizationSchema,
} from "../../patientData/schemas/patientNoteComponentsSchema"

const MODEL = "gpt-4o-2024-08-06"
const SYSTEM_MESSAGE =
	"You are a doctor reviewing and categorizing medical cases via patient notes"

const USER_MESSAGE = `
	You are being given medical notes from a medical case with a patient. I would like you to first think of the note as three components: context (context for the medical case, before this instance of care), procedure(s) attempted (as one or many), and result of procedures.
	Then for each group, I would like you to identify medical keywords in the text, give it a semantic name which can have multiple tokens separated by a space but should only represent one "thing" without quantitative or qualitative description, and categorize them into the given categories:

    type KeywordCategory {
		// Context Keywords
		demographic // age, gender, race, region, etc. of patient
		personalHistory // can include family or previous activity that led to medical condition
		medicalHistory // specific medical history of the patient

		 // Keywords for describing context or procedure
		symptom 
		suspectedDiagnosis // a diagnosis that is suspected but not confirmed. avoid using diagnosis in the keyword itself
		certainDiagnosis // a diagnosis that is confirmed. avoid using diagnosis in the keyword itself
		treatment // attempted treatment
		test // a particular medical test
		complication // unexpected symptom or diagnosis that had to be considered in regards to further procedure
		outcome // describe the outcome of case or procedure
	
		 // Measure categories
		binaryMeasure
		quantitativeMeasure
		adjectiveMeasure
	}
	If there is a word that is a measure that describes the semantic keyword, please include it in the measure field and treat it as an additional keyword and describes how it measures the keyword via the category field. add a "value" field to the measure that can be a number or adjective. intentionally open to allow for flexibility in the type of measure.
    In addition, extract a snippet of a partial or whole sentence that gives the keyword meaning in the context of the patient case.`

export const batchTokenizePatientNote = async (
	patientNotes: string,
): Promise<PatientNoteBatchKeywordTokenization> => {
	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{ role: "system", content: SYSTEM_MESSAGE },
			{
				role: "user",
				content: `${USER_MESSAGE}Patient Notes: ${patientNotes}`,
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				schema: PatientNoteBatchKeywordTokenizationResponseJSONSchema,
				name: "PatientNOteBatchKeywordTokenizationResponseJSONSchema",
			},
		},
	})

	// Extract the function call result from the response
	const result = response.choices[0]?.message?.content

	if (result) {
		const functionResult = PatientNoteBatchKeywordTokenizationSchema.parse(
			JSON.parse(result),
		)
		return functionResult
	}

	throw new Error("Failed to batch process PatientNote")
}
