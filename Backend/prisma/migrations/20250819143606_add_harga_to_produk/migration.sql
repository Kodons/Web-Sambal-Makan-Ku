/*
  Warnings:

  - Added the required column `harga` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produk` ADD COLUMN `harga` INTEGER NOT NULL;
