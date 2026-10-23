<?php

declare(strict_types=1);

use Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        $this->execute("
            CREATE TABLE IF NOT EXISTS users (
                id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name       VARCHAR(100)        NOT NULL,
                email      VARCHAR(150)        NOT NULL UNIQUE,
                password   VARCHAR(255)        NOT NULL,
                role       ENUM('admin','staff') NOT NULL DEFAULT 'staff',
                active     TINYINT(1)          NOT NULL DEFAULT 1,
                created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME            ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }

    public function down(): void
    {
        $this->execute("DROP TABLE IF EXISTS users;");
    }
}
