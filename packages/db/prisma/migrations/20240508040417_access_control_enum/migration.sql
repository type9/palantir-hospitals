-- CreateEnum
CREATE TYPE "AccessControl" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "SavedCompanion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" UUID,
    "savedInputs" JSONB,
    "accessControl" "AccessControl" NOT NULL DEFAULT 'PUBLIC',
    "savedConfiguration" JSONB,
    "name" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shortId" TEXT NOT NULL,

    CONSTRAINT "SavedCompanion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(6),
    "clerkId" TEXT,
    "lastUpdated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailAddresses" JSONB,
    "lastSignInAt" TIMESTAMP(6),
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "externalAccounts" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedCompanion_shortId_key" ON "SavedCompanion"("shortId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCompanion_id_shortId_key" ON "SavedCompanion"("id", "shortId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "SavedCompanion" ADD CONSTRAINT "SavedCompanion_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
