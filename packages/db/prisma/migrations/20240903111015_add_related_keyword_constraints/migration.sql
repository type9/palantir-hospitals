/*
  Warnings:

  - The `vector` column on the `KeywordInstance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vector` column on the `KeywordInstanceGroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `proceduresId` on the `ParsedPatientCase` table. All the data in the column will be lost.
  - The `vector` column on the `ParsedPatientCase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `semantic_name` on the `UniqueKeyword` table. All the data in the column will be lost.
  - The `vector` column on the `UniqueKeyword` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[procedureIds]` on the table `ParsedPatientCase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semanticName,category]` on the table `UniqueKeyword` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientUid` to the `PatientCaseData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semanticName` to the `UniqueKeyword` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "KeywordRelation" AS ENUM ('cooccurrence', 'describes');

-- DropForeignKey
ALTER TABLE "ParsedPatientCase" DROP CONSTRAINT "ParsedPatientCase_proceduresId_fkey";

-- DropIndex
DROP INDEX "ParsedPatientCase_proceduresId_key";

-- AlterTable
ALTER TABLE "KeywordInstance" DROP COLUMN "vector",
ADD COLUMN     "vector" vector(256);

-- AlterTable
ALTER TABLE "KeywordInstanceGroup" ADD COLUMN     "parentCaseAsProcedure" TEXT,
DROP COLUMN "vector",
ADD COLUMN     "vector" vector(256);

-- AlterTable
ALTER TABLE "ParsedPatientCase" DROP COLUMN "proceduresId",
ADD COLUMN     "procedureIds" TEXT[],
DROP COLUMN "vector",
ADD COLUMN     "vector" vector(256);

-- AlterTable
ALTER TABLE "PatientCaseData" ADD COLUMN     "patientAge" INTEGER,
ADD COLUMN     "patientGender" "Gender",
ADD COLUMN     "patientNote" TEXT,
ADD COLUMN     "patientUid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UniqueKeyword" DROP COLUMN "semantic_name",
ADD COLUMN     "semanticName" TEXT NOT NULL,
DROP COLUMN "vector",
ADD COLUMN     "vector" vector(256);

-- CreateTable
CREATE TABLE "RelatedKeywords" (
    "id" TEXT NOT NULL,
    "fromKeywordId" TEXT NOT NULL,
    "toKeywordId" TEXT NOT NULL,
    "relationType" "KeywordRelation" NOT NULL,

    CONSTRAINT "RelatedKeywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedKeywordGroupOccurrences" (
    "id" TEXT NOT NULL,
    "relatedKeywordsId" TEXT NOT NULL,
    "keywordInstanceGroupId" TEXT NOT NULL,

    CONSTRAINT "RelatedKeywordGroupOccurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedKeywordCaseOccurrences" (
    "id" TEXT NOT NULL,
    "relatedKeywordsId" TEXT NOT NULL,
    "parsedPatientCaseId" TEXT NOT NULL,

    CONSTRAINT "RelatedKeywordCaseOccurrences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RelatedKeywords_fromKeywordId_toKeywordId_relationType_idx" ON "RelatedKeywords"("fromKeywordId", "toKeywordId", "relationType");

-- CreateIndex
CREATE INDEX "RelatedKeywords_fromKeywordId_toKeywordId_idx" ON "RelatedKeywords"("fromKeywordId", "toKeywordId");

-- CreateIndex
CREATE INDEX "RelatedKeywords_relationType_idx" ON "RelatedKeywords"("relationType");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedKeywords_fromKeywordId_toKeywordId_relationType_key" ON "RelatedKeywords"("fromKeywordId", "toKeywordId", "relationType");

-- CreateIndex
CREATE INDEX "RelatedKeywordGroupOccurrences_relatedKeywordsId_keywordIns_idx" ON "RelatedKeywordGroupOccurrences"("relatedKeywordsId", "keywordInstanceGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedKeywordGroupOccurrences_relatedKeywordsId_keywordIns_key" ON "RelatedKeywordGroupOccurrences"("relatedKeywordsId", "keywordInstanceGroupId");

-- CreateIndex
CREATE INDEX "RelatedKeywordCaseOccurrences_relatedKeywordsId_parsedPatie_idx" ON "RelatedKeywordCaseOccurrences"("relatedKeywordsId", "parsedPatientCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedKeywordCaseOccurrences_relatedKeywordsId_parsedPatie_key" ON "RelatedKeywordCaseOccurrences"("relatedKeywordsId", "parsedPatientCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedPatientCase_procedureIds_key" ON "ParsedPatientCase"("procedureIds");

-- CreateIndex
CREATE INDEX "UniqueKeyword_semanticName_category_idx" ON "UniqueKeyword"("semanticName", "category");

-- CreateIndex
CREATE UNIQUE INDEX "UniqueKeyword_semanticName_category_key" ON "UniqueKeyword"("semanticName", "category");

-- AddForeignKey
ALTER TABLE "RelatedKeywords" ADD CONSTRAINT "RelatedKeywords_fromKeywordId_fkey" FOREIGN KEY ("fromKeywordId") REFERENCES "UniqueKeyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedKeywords" ADD CONSTRAINT "RelatedKeywords_toKeywordId_fkey" FOREIGN KEY ("toKeywordId") REFERENCES "UniqueKeyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedKeywordGroupOccurrences" ADD CONSTRAINT "RelatedKeywordGroupOccurrences_relatedKeywordsId_fkey" FOREIGN KEY ("relatedKeywordsId") REFERENCES "RelatedKeywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedKeywordGroupOccurrences" ADD CONSTRAINT "RelatedKeywordGroupOccurrences_keywordInstanceGroupId_fkey" FOREIGN KEY ("keywordInstanceGroupId") REFERENCES "KeywordInstanceGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedKeywordCaseOccurrences" ADD CONSTRAINT "RelatedKeywordCaseOccurrences_relatedKeywordsId_fkey" FOREIGN KEY ("relatedKeywordsId") REFERENCES "RelatedKeywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedKeywordCaseOccurrences" ADD CONSTRAINT "RelatedKeywordCaseOccurrences_parsedPatientCaseId_fkey" FOREIGN KEY ("parsedPatientCaseId") REFERENCES "ParsedPatientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordInstanceGroup" ADD CONSTRAINT "KeywordInstanceGroup_parentCaseAsProcedure_fkey" FOREIGN KEY ("parentCaseAsProcedure") REFERENCES "ParsedPatientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
