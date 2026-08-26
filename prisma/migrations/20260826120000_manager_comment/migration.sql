-- AlterTable
ALTER TABLE `FormSubmission` ADD COLUMN `managerComment` TEXT NULL;

-- CreateIndex
CREATE INDEX `FormSubmission_status_idx` ON `FormSubmission`(`status`);

-- AlterTable
ALTER TABLE `SubmissionHistory` ADD COLUMN `managerComment` TEXT NULL;
