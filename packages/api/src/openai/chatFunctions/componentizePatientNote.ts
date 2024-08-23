import { openai } from ".."
import {
	ComponentizePatientNoteResponseJSONSchema,
	PatientNoteComponents,
	PatientNoteComponentsSchema,
} from "../../patientData/schemas/patientNoteComponentsSchema"

const COMPONENTIZE_PATIENT_NOTES = "componentize_patient_notes"
const MODEL = "gpt-4o-mini"
const SYSTEM_MESSAGE = "You are a doctor reviewing a patient's notes"
const USER_MESSAGE =
	"You are being given medical notes from a medical case with a patient. I would like you to separate out the note into three components: context (context for the medical case, pre this instance of care), procedure(s) attempted (as an array), and result of procedures."

export const componentizePatientNote = async (
	patientNotes: string,
): Promise<PatientNoteComponents> => {
	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{ role: "system", content: SYSTEM_MESSAGE },
			{
				role: "user",
				content: `${USER_MESSAGE}\n\nPatient Notes: ${patientNotes}`,
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				schema: ComponentizePatientNoteResponseJSONSchema,
				name: "ComponentizePatientNoteResponseJSONSchema",
			},
		},
	})

	// Extract the function call result from the response
	const result = response.choices[0]?.message?.content

	if (result) {
		const functionResult = PatientNoteComponentsSchema.parse(
			JSON.parse(result),
		)
		return functionResult
	}

	throw new Error("Failed to componentize patient notes")
}
