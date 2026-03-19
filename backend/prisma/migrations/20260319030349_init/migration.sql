/*
  Warnings:

  - Made the column `transaction_id` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paid_at` on table `payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `transaction_id` VARCHAR(255) NOT NULL,
    MODIFY `method` VARCHAR(50) NOT NULL,
    MODIFY `paid_at` DATETIME(6) NOT NULL,
    ALTER COLUMN `currency` DROP DEFAULT;
