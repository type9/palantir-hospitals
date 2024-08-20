-- CreateEnum
CREATE TYPE "KeywordCategory" AS ENUM ('demographic', 'personalHistory', 'medicalHistory', 'symptom', 'binaryMeasure', 'quantitativeMeasure', 'adjectiveMeasure', 'suspectedDiagnosis', 'certainDiagnosis', 'treatment', 'test', 'complication', 'outcome');

-- CreateTable
CREATE TABLE "UniqueKeyword" (
    "id" TEXT NOT NULL,
    "semantic_name" TEXT NOT NULL,
    "category" "KeywordCategory" NOT NULL,
    "vector" DOUBLE PRECISION[],

    CONSTRAINT "UniqueKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordInstance" (
    "id" TEXT NOT NULL,
    "relatedCaseId" TEXT NOT NULL,
    "uniqueKeywordId" TEXT NOT NULL,
    "measureId" TEXT,
    "contextSentence" TEXT NOT NULL,
    "keywordGroupId" TEXT NOT NULL,
    "vector" DOUBLE PRECISION[],
    "note" TEXT,

    CONSTRAINT "KeywordInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measure" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unitId" TEXT,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordInstanceGroup" (
    "id" TEXT NOT NULL,
    "vector" DOUBLE PRECISION[],

    CONSTRAINT "KeywordInstanceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParsedPatientCase" (
    "id" TEXT NOT NULL,
    "patientCaseDataId" TEXT NOT NULL,
    "patientContextId" TEXT,
    "proceduresId" TEXT,
    "caseResultId" TEXT,
    "vector" DOUBLE PRECISION[],

    CONSTRAINT "ParsedPatientCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientCaseData" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "parsedAt" TIMESTAMP(3),

    CONSTRAINT "PatientCaseData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParsedPatientCase_patientCaseDataId_key" ON "ParsedPatientCase"("patientCaseDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedPatientCase_patientContextId_key" ON "ParsedPatientCase"("patientContextId");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedPatientCase_proceduresId_key" ON "ParsedPatientCase"("proceduresId");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedPatientCase_caseResultId_key" ON "ParsedPatientCase"("caseResultId");

-- AddForeignKey
ALTER TABLE "KeywordInstance" ADD CONSTRAINT "KeywordInstance_keywordGroupId_fkey" FOREIGN KEY ("keywordGroupId") REFERENCES "KeywordInstanceGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordInstance" ADD CONSTRAINT "KeywordInstance_uniqueKeywordId_fkey" FOREIGN KEY ("uniqueKeywordId") REFERENCES "UniqueKeyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordInstance" ADD CONSTRAINT "KeywordInstance_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "Measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UniqueKeyword"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedPatientCase" ADD CONSTRAINT "ParsedPatientCase_patientContextId_fkey" FOREIGN KEY ("patientContextId") REFERENCES "KeywordInstanceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedPatientCase" ADD CONSTRAINT "ParsedPatientCase_proceduresId_fkey" FOREIGN KEY ("proceduresId") REFERENCES "KeywordInstanceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedPatientCase" ADD CONSTRAINT "ParsedPatientCase_caseResultId_fkey" FOREIGN KEY ("caseResultId") REFERENCES "KeywordInstanceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedPatientCase" ADD CONSTRAINT "ParsedPatientCase_patientCaseDataId_fkey" FOREIGN KEY ("patientCaseDataId") REFERENCES "PatientCaseData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
