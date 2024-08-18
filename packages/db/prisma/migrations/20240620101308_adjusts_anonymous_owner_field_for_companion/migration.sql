-- AlterTable
ALTER TABLE "SavedCompanion" ALTER COLUMN "anonymousOwner" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "SavedCompanion" ADD CONSTRAINT "SavedCompanion_anonymousOwner_fkey" FOREIGN KEY ("anonymousOwner") REFERENCES "AnonymousUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
