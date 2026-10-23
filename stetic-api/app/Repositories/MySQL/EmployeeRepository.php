<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

class EmployeeRepository extends BaseRepository
{
    protected string $table = 'employees';

    public function findActive(): array
    {
        return $this->fetchAll(
            "SELECT * FROM `{$this->table}` WHERE active = 1 ORDER BY name ASC"
        );
    }

    public function findActivePublic(): array
    {
        return $this->fetchAll(
            "SELECT id, name, speciality FROM `{$this->table}` WHERE active = 1 ORDER BY name ASC"
        );
    }

    public function findByEmail(string $email): ?array
    {
        return $this->fetchOne(
            "SELECT * FROM `{$this->table}` WHERE email = ? LIMIT 1",
            's',
            [$email]
        );
    }

    public function findSchedulesByEmployee(int $employeeId, int $dayOfWeek): array
    {
        return $this->fetchAll(
            "SELECT id, employee_id, day_of_week, start_time, end_time 
             FROM employee_schedules 
             WHERE employee_id = ? AND day_of_week = ? 
             ORDER BY start_time ASC",
            'ii',
            [$employeeId, $dayOfWeek]
        );
    }

    public function findTimeOffByEmployeeAndDate(int $employeeId, string $date): array
    {
        return $this->fetchAll(
            "SELECT id, employee_id, date_from, date_to, reason 
             FROM employee_time_off 
             WHERE employee_id = ? AND date_from <= ? AND date_to >= ?",
            'iss',
            [$employeeId, $date, $date]
        );
    }

    public function findAppointmentsByEmployeeAndDate(int $employeeId, string $date): array
    {
        return $this->fetchAll(
            "SELECT id, employee_id, scheduled_at, ends_at, status 
             FROM appointments 
             WHERE employee_id = ? 
             AND DATE(scheduled_at) = ? 
             AND status IN ('pending', 'confirmed', 'completed')
             ORDER BY scheduled_at ASC",
            'is',
            [$employeeId, $date]
        );
    }
}
