<?php

declare(strict_types=1);

use Database\Migrations\Migration;

class CreateServicesTable extends Migration
{
    public function up(): void
    {
        $this->execute("
            CREATE TABLE IF NOT EXISTS services (
                id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name        VARCHAR(100)   NOT NULL,
                description TEXT,
                category    VARCHAR(80),
                duration    SMALLINT UNSIGNED NOT NULL COMMENT 'Duration in minutes',
                price       DECIMAL(10, 2) NOT NULL,
                active      TINYINT(1)     NOT NULL DEFAULT 1,
                created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at  DATETIME       ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }

    public function down(): void
    {
        $this->execute("DROP TABLE IF EXISTS services;");
    }
}
