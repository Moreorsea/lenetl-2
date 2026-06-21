/*
  Warnings:

  - Made the column `email` on table `formsubmission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `formsubmission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `formsubmission` MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `message` VARCHAR(191) NOT NULL;
