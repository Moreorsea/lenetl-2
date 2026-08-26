-- CreateTable
CREATE TABLE `SubmissionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalSubmissionId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `consent` BOOLEAN NOT NULL,
    `status` ENUM('NEW', 'WAITING_CLARIFICATION', 'PROCESSED', 'CLOSED') NOT NULL,
    `filesCount` INTEGER NOT NULL DEFAULT 0,
    `submittedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NOT NULL,
    `archivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SubmissionHistory_archivedAt_idx`(`archivedAt`),
    INDEX `SubmissionHistory_originalSubmissionId_idx`(`originalSubmissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
