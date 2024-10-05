// import { PatientCaseData } from "@colorchordsapp/db"

// import { createKeywordInstanceGroup } from "../../keywords/utils/createKeywordInstanceGroup"
// import { batchTokenizePatientNote } from "../../openai/chatFunctions/batchTokenization"
// import { WithServerContext } from "../../trpc"

// export const parseSinglePatientCaseData = async ({
// 	rowData,
// 	ctx,
// }: WithServerContext<{ rowData: PatientCaseData }>) => {
// 	const relatedCaseId = rowData.id
// 	try {
// 		console.time(`BatchPatientDataParse CaseID ${relatedCaseId}`)
// 		await ctx.db.$transaction(
// 			async (tx) => {
// 				console.time(`Tokenizing CaseID ${relatedCaseId}`)
// 				if (!rowData.patientNote)
// 					throw new Error("Patient note is missing")
// 				const batchTokenization = await batchTokenizePatientNote(
// 					rowData.patientNote,
// 				)
// 				console.timeEnd(`Tokenizing CaseID ${relatedCaseId}`)

// 				console.time(
// 					`Creating keyword groups for CaseID ${relatedCaseId}`,
// 				)
// 				const parsedContextKeywordGroupId =
// 					await createKeywordInstanceGroup({
// 						keywords: batchTokenization.context,
// 						patientCaseContext: { relatedCaseId },
// 						tx,
// 					})

// 				const parsedProceduresGroupIds = await Promise.all(
// 					batchTokenization.procedures.map(async (procedure) =>
// 						createKeywordInstanceGroup({
// 							keywords: procedure,
// 							patientCaseContext: { relatedCaseId },
// 							tx,
// 						}),
// 					),
// 				)

// 				const parsedResultKeywordGroupId =
// 					await createKeywordInstanceGroup({
// 						keywords: batchTokenization.result,
// 						patientCaseContext: { relatedCaseId },
// 						tx,
// 					})
// 				console.timeEnd(
// 					`Creating keyword groups for CaseID ${relatedCaseId}`,
// 				)

// 				const parsedPatientCaseId = await tx.parsedPatientCase
// 					.create({
// 						data: {
// 							patientCaseData: { connect: { id: rowData.id } },
// 							patientContext: {
// 								connect: { id: parsedContextKeywordGroupId },
// 							},
// 							caseProcedures: {
// 								connect: parsedProceduresGroupIds.map((id) => ({
// 									id,
// 								})),
// 							},
// 							caseResult: {
// 								connect: { id: parsedResultKeywordGroupId },
// 							},
// 						},
// 					})
// 					.then((result) => result.id)

// 				await tx.patientCaseData.update({
// 					where: { id: relatedCaseId },
// 					data: {
// 						parsedAt: new Date(),
// 					},
// 				})
// 				console.log(
// 					`Parsed CaseID ${relatedCaseId} with ID ${parsedPatientCaseId}`,
// 				)
// 			},
// 			{ timeout: 1000 * 60 * 3 },
// 		)
// 		console.timeEnd(`BatchPatientDataParse CaseID ${relatedCaseId}`)
// 	} catch (error) {
// 		console.error(`Failed to parse CaseID ${relatedCaseId}`)
// 		throw error
// 	}
// }
