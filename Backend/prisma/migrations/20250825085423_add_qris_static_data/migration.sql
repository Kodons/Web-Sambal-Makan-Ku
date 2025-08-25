/*
  Warnings:

  - You are about to drop the column `qrisImageUrl` on the `setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `setting` DROP COLUMN `qrisImageUrl`,
    ADD COLUMN `qrisStaticData` TEXT NULL;
