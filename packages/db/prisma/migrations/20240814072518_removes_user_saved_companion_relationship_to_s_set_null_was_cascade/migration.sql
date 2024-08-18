-- DropForeignKey
ALTER TABLE "SavedCompanion" DROP CONSTRAINT "SavedCompanion_anonymousOwner_fkey";

-- DropForeignKey
ALTER TABLE "SavedCompanion" DROP CONSTRAINT "SavedCompanion_owner_fkey";

-- AddForeignKey
ALTER TABLE "SavedCompanion" ADD CONSTRAINT "SavedCompanion_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCompanion" ADD CONSTRAINT "SavedCompanion_anonymousOwner_fkey" FOREIGN KEY ("anonymousOwner") REFERENCES "AnonymousUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
