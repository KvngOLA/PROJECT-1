/*
  Warnings:

  - Added the required column `expiresAt` to the `otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `otp_expiresAt_idx` ON `otp`(`expiresAt`);
