-- AlterTable
ALTER TABLE `payment` ADD COLUMN `approval_number` VARCHAR(50) NULL,
    ADD COLUMN `card_brand` VARCHAR(20) NULL,
    ADD COLUMN `card_number` VARCHAR(20) NULL,
    ADD COLUMN `currency` VARCHAR(10) NOT NULL DEFAULT 'KRW',
    ADD COLUMN `installment_month` INTEGER NULL;
