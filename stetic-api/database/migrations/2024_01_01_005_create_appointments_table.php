<?php

declare(strict_types=1);

use Database\Migrations\Migration;

class CreateAppointmentsTable extends Migration
{
    public function up(): void
    {
        $this->execute("
            CREATE TABLE IF NOT EXISTS appointments (
                id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                client_id    INT UNSIGNED NOT NULL,
                service_id   INT UNSIGNED NOT NULL,
                employee_id  INT UNSIGNED NOT NULL,
                scheduled_at DATETIME     NOT NULL,
                status       ENUM('pending','confirmed','completed','cancelled','no_show')
                             NOT NULL DEFAULT 'pending',
                notes        TEXT,
                created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at   DATETIME     ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id)   REFERENCES clients(id)   ON DELETE CASCADE,
                FOREIGN KEY (service_id)  REFERENCES services(id)  ON DELETE RESTRICT,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
                INDEX idx_scheduled_at (scheduled_at),
                INDEX idx_status       (status),
                INDEX idx_client       (client_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }

    public function down(): void
    {
        $this->execute("DROP TABLE IF EXISTS appointments;");
    }
}
