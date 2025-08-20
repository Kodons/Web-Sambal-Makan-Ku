/*
  Warnings:

  - A unique constraint covering the columns `[platform]` on the table `SocialMediaLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SocialMediaLink_platform_key` ON `SocialMediaLink`(`platform`);
