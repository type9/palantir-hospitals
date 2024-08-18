/*
  Warnings:

  - The primary key for the `AnonymousUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "SavedCompanion" DROP CONSTRAINT "SavedCompanion_anonymousOwner_fkey";

-- AlterTable
ALTER TABLE "AnonymousUser" DROP CONSTRAINT "AnonymousUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "expiresAt" DROP NOT NULL,
ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "AnonymousUser_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AnonymousSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonymousSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnonymousSession" ADD CONSTRAINT "AnonymousSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
