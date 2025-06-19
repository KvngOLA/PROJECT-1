/*
  Warnings:

  - You are about to drop the column `userId` on the `otp` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `otp_userId_fkey`;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `userId`;
