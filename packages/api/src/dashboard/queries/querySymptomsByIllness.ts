import { Prisma } from "@colorchordsapp/db"
import {
	COVID19TrackerSymptomView,
	COVID19TrackerSymptomViewSchema,
} from "@colorchordsapp/db/zod"
import { z } from "zod"

import { WithServerContext } from "../../trpc"

export const QuerySymptomsByIllnessArgsSchema = z.object({
	illnesses: z.array(z.string()),
	limit: z.number().int().positive().default(10),
})
export type QuerySymptomsByIllnessArgs = z.infer<
	typeof QuerySymptomsByIllnessArgsSchema
>

export const QuerySymptomsByIllnessReturnSchema =
	COVID19TrackerSymptomViewSchema.array()

export type QuerySymptomsByIllnessReturnType = z.infer<
	typeof QuerySymptomsByIllnessReturnSchema
>

export const querySymptomsByIllness = async ({
	illnesses,
	ctx,
	limit = 10,
}: WithServerContext<QuerySymptomsByIllnessArgs>): Promise<
	COVID19TrackerSymptomView[]
> => {
	const finalResults = await ctx.db
		.$queryRaw<QuerySymptomsByIllnessReturnType>`
    WITH DiagnosisKeywords AS (
        SELECT uk."id" AS "diagnosisKeywordId"
        FROM "UniqueKeyword" uk
        WHERE uk."semanticName" IN (${Prisma.join(illnesses)}) AND uk."category" = 'certainDiagnosis'
        
        UNION
        
        SELECT uk2."id" AS "diagnosisKeywordId"
        FROM "UniqueKeyword" uk2
        INNER JOIN "UniqueKeywordClusterResult" ukcr2 ON uk2."id" = ukcr2."keywordId"
        WHERE ukcr2."cluster" IN (
        SELECT DISTINCT ukcr."cluster"
        FROM "UniqueKeyword" uk
        INNER JOIN "UniqueKeywordClusterResult" ukcr ON uk."id" = ukcr."keywordId"
        WHERE uk."semanticName" IN (${Prisma.join(illnesses)}) AND uk."category" = 'certainDiagnosis'
        )
        AND uk2."category" = 'certainDiagnosis'
    ),

    -- Step 2: Find Symptoms Directly Related to Diagnosis Keywords
   CaseDirectlyRelatedKeywords AS (
        SELECT DISTINCT
            rk."id" AS "relationId",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN fk."id"
                ELSE tk."id"
            END AS "diagnosisKeywordId",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN tk."id"
                ELSE fk."id"
            END AS "symptomKeywordId",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN COALESCE(fk_cr."cluster", -1)
                ELSE COALESCE(tk_cr."cluster", -1)
            END AS "diagnosisKeywordCluster",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN COALESCE(tk_cr."cluster", -1)
                ELSE COALESCE(fk_cr."cluster", -1)
            END AS "symptomKeywordCluster",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN fk_cr."category"
                ELSE tk_cr."category"
            END AS "diagnosisKeywordCategory",
            CASE 
                WHEN fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) THEN tk_cr."category"
                ELSE fk_cr."category"
            END AS "symptomKeywordCategory"
        FROM "RelatedKeywords" rk
        INNER JOIN "UniqueKeyword" fk ON rk."fromKeywordId" = fk."id"
        INNER JOIN "UniqueKeyword" tk ON rk."toKeywordId" = tk."id"
        LEFT JOIN "UniqueKeywordClusterResult" fk_cr ON fk."id" = fk_cr."keywordId"
        LEFT JOIN "UniqueKeywordClusterResult" tk_cr ON tk."id" = tk_cr."keywordId"
        WHERE 
            (fk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords) OR tk."id" IN (SELECT "diagnosisKeywordId" FROM DiagnosisKeywords))
            AND (fk."category" = 'symptom' OR tk."category" = 'symptom')
    ),

    -- Step 3: Extend Related Keywords Using Clusters
    ExtendedRelatedKeywords AS (
        SELECT DISTINCT
            drk."relationId",
            drk."diagnosisKeywordId",
            drk."symptomKeywordId",
            drk."diagnosisKeywordCluster",
            drk."symptomKeywordCluster",
            drk."symptomKeywordCategory"
        FROM CaseDirectlyRelatedKeywords drk

        UNION ALL

        SELECT DISTINCT
            rk."id" AS "relationId",
            drk."diagnosisKeywordId",
            ukcr2."keywordId" AS "symptomKeywordId",
            drk."diagnosisKeywordCluster",
            COALESCE(ukcr2."cluster", -1) AS "symptomKeywordCluster",
            ukcr2."category" AS "symptomKeywordCategory"
        FROM CaseDirectlyRelatedKeywords drk
        INNER JOIN "UniqueKeywordClusterResult" ukcr1
            ON drk."symptomKeywordId" = ukcr1."keywordId"
            AND drk."symptomKeywordCategory" = ukcr1."category"
        INNER JOIN "UniqueKeywordClusterResult" ukcr2
            ON ukcr1."cluster" = ukcr2."cluster"
            AND ukcr1."category" = ukcr2."category"
            AND ukcr1."keywordId" <> ukcr2."keywordId"
        INNER JOIN "RelatedKeywords" rk
            ON (rk."fromKeywordId" = drk."diagnosisKeywordId" AND rk."toKeywordId" = ukcr2."keywordId")
            OR (rk."toKeywordId" = drk."diagnosisKeywordId" AND rk."fromKeywordId" = ukcr2."keywordId")
        WHERE drk."symptomKeywordCluster" != -1
    ),

    -- Step 4: Create Keyword Groupings for Related Keywords (B)
    KeywordGroups AS (
        SELECT 
            erk."symptomKeywordId",
            erk."symptomKeywordCluster",
            erk."symptomKeywordCategory",
            CASE 
                WHEN erk."symptomKeywordCluster" = -1 THEN CONCAT(erk."symptomKeywordId", '_', erk."symptomKeywordCategory")
                ELSE CONCAT(erk."symptomKeywordCluster", '_', erk."symptomKeywordCategory")
            END AS "keywordGroupId"
        FROM ExtendedRelatedKeywords erk
    ),

    -- Step 5: Support A (All Diagnosis Keywords and Their Clusters)
    SupportA AS (
        SELECT 
            'A_cluster' AS "singleClusterId",
            ARRAY_AGG(DISTINCT rkc."parsedPatientCaseId") AS "supportACaseIds",
            COUNT(DISTINCT rkc."parsedPatientCaseId") AS "supportACasesCount"
        FROM DiagnosisKeywords dk
        INNER JOIN "RelatedKeywords" rk 
            ON rk."fromKeywordId" = dk."diagnosisKeywordId" OR rk."toKeywordId" = dk."diagnosisKeywordId"
        INNER JOIN "RelatedKeywordCaseOccurrences" rkc 
            ON rkc."relatedKeywordsId" = rk."id"
    ),

    -- Step 6: Support B (Grouped by KeywordGroupId)
    SupportB AS (
        SELECT
            kg."keywordGroupId",
            ARRAY_AGG(DISTINCT rkc."parsedPatientCaseId") AS "supportBCaseIds",
            COUNT(DISTINCT rkc."parsedPatientCaseId") AS "supportBCasesCount"
        FROM KeywordGroups kg
        INNER JOIN "RelatedKeywords" rk 
            ON rk."fromKeywordId" = kg."symptomKeywordId" OR rk."toKeywordId" = kg."symptomKeywordId"
        INNER JOIN "RelatedKeywordCaseOccurrences" rkc 
            ON rkc."relatedKeywordsId" = rk."id"
        GROUP BY kg."keywordGroupId"
    ),

    -- Step 7: Support A AND B
    SupportAB AS (
        SELECT
            'A_cluster' AS "singleClusterId",
            kg."keywordGroupId",
            ARRAY_AGG(DISTINCT rkc."parsedPatientCaseId") AS "supportAAndBCaseIds",
            COUNT(DISTINCT rkc."parsedPatientCaseId") AS "supportAAndBCasesCount"
        FROM ExtendedRelatedKeywords erk
        INNER JOIN KeywordGroups kg 
            ON erk."symptomKeywordId" = kg."symptomKeywordId"
        INNER JOIN "RelatedKeywords" rk 
            ON (rk."fromKeywordId" = erk."diagnosisKeywordId" AND rk."toKeywordId" = kg."symptomKeywordId")
                OR (rk."toKeywordId" = erk."diagnosisKeywordId" AND rk."fromKeywordId" = kg."symptomKeywordId")
        INNER JOIN "RelatedKeywordCaseOccurrences" rkc 
            ON rkc."relatedKeywordsId" = rk."id"
        GROUP BY kg."keywordGroupId"
    ),

    -- Step 8: Compute Confidence and Lift
    ConfidenceLift AS (
        SELECT 
            ab."keywordGroupId" AS "keywordGroupBId",
            ab."supportAAndBCaseIds",
            ab."supportAAndBCasesCount",
            a."supportACaseIds",
            a."supportACasesCount",
            b."supportBCaseIds",
            b."supportBCasesCount",
            (ab."supportAAndBCasesCount"::FLOAT / a."supportACasesCount") AS "confidence",
            (ab."supportAAndBCasesCount"::FLOAT / (a."supportACasesCount" * b."supportBCasesCount")) AS "lift"
        FROM SupportAB ab
        INNER JOIN SupportA a ON ab."singleClusterId" = a."singleClusterId"
        INNER JOIN SupportB b ON ab."keywordGroupId" = b."keywordGroupId"
    ),

   -- Step 9: Final Results
   FinalResults AS (
    SELECT 
        cl."keywordGroupBId",
        ARRAY_AGG(DISTINCT kg."symptomKeywordId") AS "uniqueKeywordIds",
        ARRAY_AGG(DISTINCT rk."semanticName") AS "uniqueKeywordNames",
        cl."supportAAndBCaseIds",
        cl."supportAAndBCasesCount",
        cl."supportACaseIds",
        cl."supportACasesCount",
        cl."supportBCaseIds",
        cl."supportBCasesCount",
        cl."confidence",
        cl."lift"
    FROM ConfidenceLift cl
    INNER JOIN KeywordGroups kg ON cl."keywordGroupBId" = kg."keywordGroupId"
    INNER JOIN "UniqueKeyword" rk ON kg."symptomKeywordId" = rk."id"
    GROUP BY 
        cl."keywordGroupBId",
        cl."supportAAndBCaseIds",
        cl."supportAAndBCasesCount",
        cl."supportACaseIds",
        cl."supportACasesCount",
        cl."supportBCaseIds",
        cl."supportBCasesCount",
        cl."confidence",
        cl."lift"
    HAVING cl."supportAAndBCasesCount" > 1
    ORDER BY cl."lift" DESC, cl."confidence" DESC
    LIMIT ${limit}
   )
   SELECT * FROM FinalResults
`
	return finalResults
}
