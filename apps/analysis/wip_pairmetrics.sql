SET statement_timeout = '5min';  
SET work_mem = '512MB';  
SET ivfflat.probes = 10; 

DROP TABLE IF EXISTS "TempCaseRelatedKeywords";
DROP TABLE IF EXISTS "TempCaseDirectlyRelatedKeywords";

-- Step 1: Create a Temporary Table for Similar Keywords to 'cough'
CREATE TEMP TABLE "TempOriginKeywords" AS 
SELECT "vector"
FROM "UniqueKeyword"
WHERE "semanticName" = 'cough' AND "category" = 'symptom'
LIMIT 1;

CREATE TEMP TABLE "TempSymptomKeywords" AS 
SELECT 
  uk."id",
  uk."semanticName",
  uk."category",
  (1 - (uk."vector" <-> cv."vector")) AS similarity
FROM "UniqueKeyword" uk, "TempOriginKeywords" cv
WHERE 
  (1 - (uk."vector" <-> cv."vector")) >= 0.5
  AND uk."semanticName" <> 'cough'
ORDER BY similarity DESC
LIMIT 50;

-- Step 1a: Create Index on TempSymptomKeywords to Improve Lookup Performance
CREATE INDEX idx_TempSymptomKeywords_id ON "TempSymptomKeywords"("id");

-- Step 2: Temporary Table for Directly Related Keywords
CREATE TEMP TABLE "TempCaseDirectlyRelatedKeywords" AS 
SELECT DISTINCT
    rk."id" AS "relationId",
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN fk."id"
        ELSE tk."id"
    END AS "similarKeywordId",
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN tk."id"
        ELSE fk."id"
    END AS "relatedKeywordId",
    -- Assign clusters based on which keyword is the 'similarKeywordId'
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN COALESCE(fk_cr."cluster", -1)
        ELSE COALESCE(tk_cr."cluster", -1)
    END AS "similarKeywordCluster",
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN COALESCE(tk_cr."cluster", -1)
        ELSE COALESCE(fk_cr."cluster", -1)
    END AS "relatedKeywordCluster",
    -- Assign categories in the same way
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN fk_cr."category"
        ELSE tk_cr."category"
    END AS "similarKeywordCategory",
    CASE 
        WHEN fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") THEN tk_cr."category"
        ELSE fk_cr."category"
    END AS "relatedKeywordCategory"
FROM "RelatedKeywords" rk
INNER JOIN "UniqueKeyword" fk ON rk."fromKeywordId" = fk."id"
INNER JOIN "UniqueKeyword" tk ON rk."toKeywordId" = tk."id"
LEFT JOIN "UniqueKeywordClusterResult" fk_cr ON fk."id" = fk_cr."keywordId"
LEFT JOIN "UniqueKeywordClusterResult" tk_cr ON tk."id" = tk_cr."keywordId"
WHERE 
  (fk."id" IN (SELECT "id" FROM "TempSymptomKeywords") OR tk."id" IN (SELECT "id" FROM "TempSymptomKeywords"))
  AND (fk."category" IN ('certainDiagnosis', 'suspectedDiagnosis') OR tk."category" IN ('certainDiagnosis', 'suspectedDiagnosis'));


-- Step 2a: Create Indexes on the TempCaseDirectlyRelatedKeywords Table
CREATE INDEX idx_TempDirectlyRelated_similarKeywordId ON "TempCaseDirectlyRelatedKeywords"("similarKeywordId");
CREATE INDEX idx_TempDirectlyRelated_relatedKeywordId ON "TempCaseDirectlyRelatedKeywords"("relatedKeywordId");
CREATE INDEX idx_TempDirectlyRelated_relatedKeywordCluster ON "TempCaseDirectlyRelatedKeywords"("relatedKeywordCluster");
CREATE INDEX idx_TempDirectlyRelated_relatedKeywordCategory ON "TempCaseDirectlyRelatedKeywords"("relatedKeywordCategory");

-- Step 3: Extend the Temporary Table for Related Keywords Using Clusters
CREATE TEMP TABLE "TempCaseRelatedKeywords" AS 
SELECT DISTINCT
    drk."relationId",
    drk."similarKeywordId",
    drk."relatedKeywordId",
    drk."similarKeywordCluster",
    drk."relatedKeywordCluster",
    drk."relatedKeywordCategory"
FROM "TempCaseDirectlyRelatedKeywords" drk

UNION ALL

-- Include all rows from the previous temporary table
SELECT 
    drk."relationId",
    drk."similarKeywordId",
    drk."relatedKeywordId",
    drk."similarKeywordCluster",
    drk."relatedKeywordCluster",
    drk."relatedKeywordCategory"
FROM "TempCaseDirectlyRelatedKeywords" drk;

-- Step 3a: Create Indexes on TempCaseRelatedKeywords to Improve Search Performance
CREATE INDEX idx_TempRelated_similarKeywordId ON "TempCaseRelatedKeywords"("similarKeywordId");
CREATE INDEX idx_TempRelated_relatedKeywordId ON "TempCaseRelatedKeywords"("relatedKeywordId");
CREATE INDEX idx_TempRelated_keywordRelation ON "TempCaseRelatedKeywords"("similarKeywordId", "relatedKeywordId");

-- Step 4: Extend TempCaseRelatedKeywords by finding additional relatedKeyword synonyms
INSERT INTO "TempCaseRelatedKeywords"
SELECT DISTINCT
    rk."id" AS "relationId",
    CASE
        WHEN drk."similarKeywordId" < ukcr2."keywordId" THEN drk."similarKeywordId"
        ELSE ukcr2."keywordId"
    END AS "similarKeywordId",
    CASE
        WHEN drk."similarKeywordId" < ukcr2."keywordId" THEN ukcr2."keywordId"
        ELSE drk."similarKeywordId"
    END AS "relatedKeywordId",
    drk."similarKeywordCluster",
    COALESCE(
        (SELECT ukcr."cluster" 
         FROM "UniqueKeywordClusterResult" ukcr 
         WHERE ukcr."keywordId" = 
           CASE
             WHEN drk."similarKeywordId" < ukcr2."keywordId" THEN ukcr2."keywordId"
             ELSE drk."similarKeywordId"
           END
         AND ukcr."category" = ukcr2."category"), 
       -1) AS "relatedKeywordCluster", -- Correctly fetch the cluster for the related keyword
    ukcr2."category" AS "relatedKeywordCategory"
FROM "TempCaseDirectlyRelatedKeywords" drk
INNER JOIN "UniqueKeywordClusterResult" ukcr1
    ON drk."relatedKeywordId" = ukcr1."keywordId"
    AND drk."relatedKeywordCategory" = ukcr1."category"
INNER JOIN "UniqueKeywordClusterResult" ukcr2
    ON ukcr1."cluster" = ukcr2."cluster"
    AND ukcr1."category" = ukcr2."category"
    AND ukcr1."keywordId" <> ukcr2."keywordId"
INNER JOIN "RelatedKeywords" rk
    ON (rk."fromKeywordId" = drk."similarKeywordId" AND rk."toKeywordId" = ukcr2."keywordId")
    OR (rk."toKeywordId" = drk."similarKeywordId" AND rk."fromKeywordId" = ukcr2."keywordId")
WHERE drk."relatedKeywordCluster" != -1  -- Ensure we don't search for synonyms if there is no cluster
AND NOT EXISTS (
    -- Simplified redundancy check using indexed relatedKeywordId
    SELECT 1 FROM "TempCaseRelatedKeywords" existing
    WHERE existing."relatedKeywordId" = CASE
        WHEN drk."similarKeywordId" < ukcr2."keywordId" THEN ukcr2."keywordId"
        ELSE drk."similarKeywordId"
    END
);

-- Step 5: Print the Number of Rows in the Final Table
SELECT * FROM "TempCaseRelatedKeywords";
