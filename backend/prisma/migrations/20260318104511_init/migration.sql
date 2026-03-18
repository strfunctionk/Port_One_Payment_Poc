-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` VARCHAR(255) NOT NULL,
    `transaction_id` VARCHAR(255) NULL,
    `user_id` INTEGER NOT NULL,
    `order_name` VARCHAR(255) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `method` VARCHAR(50) NULL,
    `paid_at` DATETIME(6) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `payment_payment_id_key`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
