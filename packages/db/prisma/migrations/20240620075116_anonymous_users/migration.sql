-- AlterTable
ALTER TABLE "SavedCompanion" ADD COLUMN     "anonymousOwner" UUID;

-- CreateTable
CREATE TABLE "AnonymousUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "AnonymousUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedCompanion" ADD CONSTRAINT "SavedCompanion_anonymousOwner_fkey" FOREIGN KEY ("anonymousOwner") REFERENCES "AnonymousUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
