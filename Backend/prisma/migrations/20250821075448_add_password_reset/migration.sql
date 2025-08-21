/*
  Warnings:

  - A unique constraint covering the columns `[resetPasswordToken]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `resetPasswordExpires` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_resetPasswordToken_key` ON `Admin`(`resetPasswordToken`);
