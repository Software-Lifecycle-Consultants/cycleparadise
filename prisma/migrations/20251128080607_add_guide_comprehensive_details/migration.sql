/*
  Warnings:

  - You are about to drop the column `bestTimeToVisit` on the `cycling_guides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cycling_guides" DROP COLUMN "bestTimeToVisit",
ALTER COLUMN "estimatedDistance" SET DATA TYPE DOUBLE PRECISION;
