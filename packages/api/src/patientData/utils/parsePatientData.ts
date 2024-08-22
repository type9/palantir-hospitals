import { ParsedPatientCase, PatientCaseData } from "@colorchordsapp/db"

import { createKeywordInstanceGroup } from "../../keywords/utils/createKeywordInstanceGroup"
import { componentizePatientNote } from "../../openai/chatFunctions/componentizePatientNote"
import { WithServerContext } from "../../trpc"

export const parsePatientCaseData = async ({
	rowData,
	ctx,
}: WithServerContext<{ rowData: PatientCaseData }>) => {
	if (!rowData.patientNote) throw new Error("Patient note is missing")
	const noteComponents = await componentizePatientNote(rowData.patientNote)

	const relatedCaseId = rowData.id
	const parsedContextKeywordGroupId = await createKeywordInstanceGroup({
		text: noteComponents.context,
		patientCaseContext: { relatedCaseId },
		ctx,
	})

	const parsedProceduresGroupIds = await Promise.all(
		noteComponents.procedures.map(async (procedure) =>
			createKeywordInstanceGroup({
				text: procedure,
				patientCaseContext: { relatedCaseId },
				ctx,
			}),
		),
	)

	const parsedResultKeywordGroupId = await createKeywordInstanceGroup({
		text: noteComponents.result,
		patientCaseContext: { relatedCaseId },
		ctx,
	})

	const parsedPatientCaseId = await ctx.db.parsedPatientCase
		.create({
			data: {
				patientCaseData: { connect: { id: rowData.id } },
				patientContext: {
					connect: { id: parsedContextKeywordGroupId },
				},
				caseProcedures: {
					connect: parsedProceduresGroupIds.map((id) => ({ id })),
				},
				caseResult: { connect: { id: parsedResultKeywordGroupId } },
			},
		})
		.then((result) => result.id)

	return parsedPatientCaseId
}
