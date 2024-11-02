/*
  Warnings:

  - Added the required column `createdById` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "ShiftStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "type" "ShiftType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Shift_userId_idx" ON "Shift"("userId");

-- CreateIndex
CREATE INDEX "Shift_createdById_idx" ON "Shift"("createdById");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
