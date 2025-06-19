-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'user', 'super_admin') NOT NULL DEFAULT 'user';
