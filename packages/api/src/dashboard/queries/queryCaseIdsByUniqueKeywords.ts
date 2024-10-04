import { Prisma } from "@colorchordsapp/db"
import { z } from "zod"

import { WithServerContext } from "../../trpc"

export const QueryCasesAndKeywordInstancesByIdsArgsSchema = z.object({
	uniqueKeywordIds: z.array(z.string()),
	parsedCaseIds: z.array(z.string()),
})

export type QueryCasesAndKeywordInstancesByIdsArgs = z.infer<
	typeof QueryCasesAndKeywordInstancesByIdsArgsSchema
>

export const QueryCasesAndKeywordInstancesByIdsReturnSchema = z
	.object({
		parsedPatientCaseId: z.string(),
		patientCaseDataId: z.string(),
		procedureIds: z.array(z.string()),
		patientUid: z.string(),
		patientNote: z.string(),
		patientAge: z.number(),
		patientGender: z.string(),
		contextSentence: z.string(),
		keywordGroupId: z.string(),
		uniqueKeywordId: z.string(),
		keywordInstanceId: z.string(),
		semanticName: z.string(),
		category: z.string(),
	})
	.array()

export type QueryCasesAndKeywordInstancesByIdsReturnType = z.infer<
	typeof QueryCasesAndKeywordInstancesByIdsReturnSchema
>

export const queryCasesAndKeywordInstancesByIds = async ({
	parsedCaseIds,
	uniqueKeywordIds,
	ctx,
}: WithServerContext<QueryCasesAndKeywordInstancesByIdsArgs>) => {
	const results = await ctx.db
		.$queryRaw<QueryCasesAndKeywordInstancesByIdsReturnType>`
        WITH GivenParsedCases AS (
            -- Step 1: Filter the ParsedPatientCase IDs
            SELECT
                ppc.id AS "parsedPatientCaseId",
                ppc."patientCaseDataId"
            FROM "ParsedPatientCase" ppc
            WHERE ppc.id IN (${Prisma.join(parsedCaseIds)})
        ),
        PatientData AS (
            -- Step 2: Retrieve the associated PatientCaseData
            SELECT
                gpc."parsedPatientCaseId",
                pcd.id AS "patientCaseDataId",
                pcd."patientUid",
                pcd."patientNote",
                pcd."patientAge",
                pcd."patientGender",
                pcd."parsedAt",
                pcd."updatedAt",
                pcd."shouldParse"
            FROM GivenParsedCases gpc
            INNER JOIN "PatientCaseData" pcd ON gpc."patientCaseDataId" = pcd.id
        ),
        RelevantKeywordInstances AS (
            -- Step 3: Filter KeywordInstances and join UniqueKeyword to get semanticName and category
            SELECT
                ki.id AS "keywordInstanceId",
                ki."relatedCaseId",
                ki."uniqueKeywordId",
                ki."measureId",
                ki."contextSentence",
                ki."keywordGroupId",
                ki."note",
                uk."semanticName",
                uk."category"
            FROM "KeywordInstance" ki
            INNER JOIN "UniqueKeyword" uk ON ki."uniqueKeywordId" = uk.id
            WHERE
                ki."relatedCaseId" IN (SELECT "patientCaseDataId" FROM GivenParsedCases)
                AND ki."uniqueKeywordId" IN (${Prisma.join(uniqueKeywordIds)})
        )
        -- Step 4: Combine the data
        SELECT
            rki."keywordInstanceId",
            rki."relatedCaseId",
            rki."uniqueKeywordId",
            rki."measureId",
            rki."contextSentence",
            rki."keywordGroupId",
            rki."note",
            rki."semanticName",
            rki."category",
            pd."parsedPatientCaseId",
            pd."patientCaseDataId",
            pd."patientUid",
            pd."patientNote",
            pd."patientAge",
            pd."patientGender",
            pd."parsedAt",
            pd."updatedAt",
            pd."shouldParse"
        FROM RelevantKeywordInstances rki
        INNER JOIN PatientData pd ON rki."relatedCaseId" = pd."patientCaseDataId"
        ORDER BY rki."relatedCaseId";
    `
	return results
}
