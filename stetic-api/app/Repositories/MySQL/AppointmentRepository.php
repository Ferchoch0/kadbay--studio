<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

class AppointmentRepository extends BaseRepository
{
    protected string $table = 'appointments';

    public function findOverlappingByEmployee(int $employeeId, string $start, string $end): array
    {
        return $this->fetchAll(
            "SELECT id, scheduled_at, ends_at, status FROM `{$this->table}`
             WHERE employee_id = ? AND status IN ('pending', 'confirmed', 'completed')
             AND scheduled_at < ? AND ends_at > ? LIMIT 1",
            'iss',
            [$employeeId, $end, $start]
        );
    }

    public function findByIdWithDetails(int $id): ?array
    {
        return $this->fetchOne(
            "SELECT a.*, s.name as service_name, s.price as service_price, e.name as employee_name
             FROM `{$this->table}` a
             LEFT JOIN services s ON a.service_id = s.id
             LEFT JOIN employees e ON a.employee_id = e.id
             WHERE a.id = ? LIMIT 1",
            'i',
            [$id]
        );
    }

    public function findByClient(int $clientId, ?string $status = null): array
    {
        if ($status) {
            return $this->fetchAll(
                "SELECT a.*, s.name as service_name, s.price as service_price, e.name as employee_name
                 FROM `{$this->table}` a
                 LEFT JOIN services s  ON a.service_id  = s.id
                 LEFT JOIN employees e ON a.employee_id = e.id
                 WHERE a.client_id = ? AND a.status = ?
                 ORDER BY a.scheduled_at DESC",
                'is',
                [$clientId, $status]
            );
        }

        return $this->fetchAll(
            "SELECT a.*, s.name as service_name, s.price as service_price, e.name as employee_name
             FROM `{$this->table}` a
             LEFT JOIN services s  ON a.service_id  = s.id
             LEFT JOIN employees e ON a.employee_id = e.id
             WHERE a.client_id = ?
             ORDER BY a.scheduled_at DESC",
            'i',
            [$clientId]
        );
    }

    public function findByDateRange(string $from, string $to, ?int $employeeId = null): array
    {
        if ($employeeId) {
            return $this->fetchAll(
                "SELECT a.*, c.name as client_name, s.name as service_name, e.name as employee_name
                 FROM `{$this->table}` a
                 LEFT JOIN clients c   ON a.client_id   = c.id
                 LEFT JOIN services s  ON a.service_id  = s.id
                 LEFT JOIN employees e ON a.employee_id = e.id
                 WHERE a.scheduled_at BETWEEN ? AND ?
                   AND a.employee_id = ?
                 ORDER BY a.scheduled_at ASC",
                'ssi',
                [$from, $to, $employeeId]
            );
        }

        return $this->fetchAll(
            "SELECT a.*, c.name as client_name, s.name as service_name, e.name as employee_name
             FROM `{$this->table}` a
             LEFT JOIN clients c   ON a.client_id   = c.id
             LEFT JOIN services s  ON a.service_id  = s.id
             LEFT JOIN employees e ON a.employee_id = e.id
             WHERE a.scheduled_at BETWEEN ? AND ?
             ORDER BY a.scheduled_at ASC",
            'ss',
            [$from, $to]
        );
    }
}
