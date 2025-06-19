/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `phone` VARCHAR(11) NOT NULL;
