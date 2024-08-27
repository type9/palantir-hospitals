import { PatientCaseData } from "@colorchordsapp/db"

import { createKeywordInstanceGroup } from "../../keywords/utils/createKeywordInstanceGroup"
import { batchTokenizePatientNote } from "../../openai/chatFunctions/batchTokenization"
import { WithServerContext } from "../../trpc"

export const batchParsePatientCaseData = async ({
	rowData,
	ctx,
}: WithServerContext<{ rowData: PatientCaseData }>) => {
	if (!rowData.patientNote) throw new Error("Patient note is missing")
	const relatedCaseId = rowData.id
	console.time(`BatchPatientDataParse CaseID ${relatedCaseId}`)

	console.time(`Tokenizing CaseID ${relatedCaseId}`)
	const batchTokenization = await batchTokenizePatientNote(
		rowData.patientNote,
	)
	console.timeEnd(`Tokenizing CaseID ${relatedCaseId}`)

	console.time(`Creating keyword groups for CaseID ${relatedCaseId}`)
	const parsedContextKeywordGroupId = await createKeywordInstanceGroup({
		keywords: batchTokenization.context,
		patientCaseContext: { relatedCaseId },
		ctx,
	})

	const parsedProceduresGroupIds = await Promise.all(
		batchTokenization.procedures.map(async (procedure) =>
			createKeywordInstanceGroup({
				keywords: procedure,
				patientCaseContext: { relatedCaseId },
				ctx,
			}),
		),
	)

	const parsedResultKeywordGroupId = await createKeywordInstanceGroup({
		keywords: batchTokenization.result,
		patientCaseContext: { relatedCaseId },
		ctx,
	})
	console.timeEnd(`Creating keyword groups for CaseID ${relatedCaseId}`)

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

	await ctx.db.patientCaseData.update({
		where: { id: relatedCaseId },
		data: {
			parsedAt: new Date(),
		},
	})

	console.timeEnd(`BatchPatientDataParse CaseID ${relatedCaseId}`)
	return parsedPatientCaseId
}
