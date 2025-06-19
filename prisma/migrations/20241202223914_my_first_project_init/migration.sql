-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_userId_fkey`;

-- DropIndex
DROP INDEX `post_userId_key` ON `post`;
