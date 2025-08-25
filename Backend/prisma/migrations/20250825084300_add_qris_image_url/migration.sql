/*
  Warnings:

  - You are about to drop the column `qrisStaticData` on the `setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `setting` DROP COLUMN `qrisStaticData`,
    ADD COLUMN `qrisImageUrl` VARCHAR(191) NULL;
