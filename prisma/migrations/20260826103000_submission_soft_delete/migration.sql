-- AlterTable
ALTER TABLE `FormSubmission` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `FormSubmission_deletedAt_idx` ON `FormSubmission`(`deletedAt`);
