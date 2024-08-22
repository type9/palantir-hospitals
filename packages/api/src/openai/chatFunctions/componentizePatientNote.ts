import { openai } from ".."
import {
	PatientNoteComponents,
	PatientNoteComponentsSchema,
} from "../../patientData/schemas/patientNoteComponentsSchema"

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
		functions: [
			{
				name: "componentize_patient_notes",
				description:
					"Separates the patient's medical notes into pre-care context, procedures attempted, and results.",
				parameters: {
					type: "object",
					properties: {
						context: {
							type: "string",
							description:
								"The context and background of the patient's condition before the medical procedures.",
						},
						procedures: {
							type: "array",
							description:
								"The medical procedures that were attempted during the patient's care.",
						},
						result: {
							type: "string",
							description:
								"The outcomes or results of the procedures attempted.",
						},
					},
					required: ["context", "procedures", "result"],
				},
			},
		],
		function_call: {
			name: "componentize_patient_notes",
		},
	})

	// Extract the function call result from the response
	const result = response.choices[0]?.message?.tool_calls?.find(
		(call) => call.id === "componentize_patient_notes",
	)?.function.arguments
	if (result) {
		const functionResult = PatientNoteComponentsSchema.parse(result)
		return functionResult
	}

	throw new Error("Failed to componentize patient notes")
}
