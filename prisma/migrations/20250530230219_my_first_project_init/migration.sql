/*
  Warnings:

  - You are about to drop the column `author` on the `otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp` DROP COLUMN `author`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;
