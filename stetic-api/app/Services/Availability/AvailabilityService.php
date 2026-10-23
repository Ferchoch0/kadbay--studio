<?php

declare(strict_types=1);

namespace App\Services\Availability;

use App\Repositories\MySQL\EmployeeRepository;
use App\Repositories\MySQL\ServiceRepository;
use DateTimeImmutable;
use DateTimeZone;

class AvailabilityService
{
    private const TIMEZONE = 'America/Argentina/Buenos_Aires';
    private const SLOT_INTERVAL_MINUTES = 30;
    private const MIN_ADVANCE_MINUTES = 60;
    private const MAX_DAYS_AHEAD = 60;

    public function __construct(
        private readonly EmployeeRepository $employeeRepository,
        private readonly ServiceRepository  $serviceRepository
    ) {}

    public function getAvailableSlots(int $serviceId, string $date, ?int $employeeId = null): array
    {
        $this->validateRequest($serviceId, $date, $employeeId);

        $service = $this->serviceRepository->findById($serviceId);
        if (!$service || $service['active'] != 1) {
            throw new \RuntimeException('Service not found', 404);
        }

        $serviceDuration = (int) $service['duration'];

        $employees = $employeeId 
            ? [$this->getEmployee($employeeId)] 
            : $this->employeeRepository->findActive();

        $timezone = new DateTimeZone(self::TIMEZONE);
        $requestedDate = new DateTimeImmutable($date, $timezone);
        $now = new DateTimeImmutable('now', $timezone);
        $dayOfWeek = (int) $requestedDate->format('N');

        $allSlots = [];
        $isToday = $requestedDate->format('Y-m-d') === $now->format('Y-m-d');

        foreach ($employees as $employee) {
            $empId = (int) $employee['id'];

            if ($this->isEmployeeOnTimeOff($empId, $date)) {
                continue;
            }

            $schedules = $this->employeeRepository->findSchedulesByEmployee($empId, $dayOfWeek);
            if (empty($schedules)) {
                continue;
            }

            $appointments = $this->employeeRepository->findAppointmentsByEmployeeAndDate($empId, $date);

            foreach ($schedules as $schedule) {
                $slots = $this->generateSlotsForSchedule(
                    $schedule,
                    $serviceDuration,
                    $date,
                    $appointments,
                    $isToday,
                    $now,
                    $timezone
                );

                foreach ($slots as $slot) {
                    $allSlots[] = [
                        'start' => $slot['start'],
                        'end' => $slot['end'],
                        'employee_id' => $empId
                    ];
                }
            }
        }

        usort($allSlots, fn($a, $b) => strcmp($a['start'], $b['start']));

        if (!$employeeId) {
            $allSlots = $this->deduplicateSlots($allSlots);
        }

        return $allSlots;
    }


    private function validateRequest(int $serviceId, string $date, ?int $employeeId): void
    {
        if ($serviceId <= 0) {
            throw new \InvalidArgumentException('Invalid service_id', 422);
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            throw new \InvalidArgumentException('Invalid date format. Use YYYY-MM-DD', 422);
        }

        $timezone = new DateTimeZone(self::TIMEZONE);
        $requestedDate = new DateTimeImmutable($date, $timezone);
        $now = new DateTimeImmutable('now', $timezone);
        $today = new DateTimeImmutable($now->format('Y-m-d'), $timezone);

        if ($requestedDate < $today) {
            throw new \InvalidArgumentException('Date cannot be in the past', 422);
        }

        $maxDate = $today->modify('+' . self::MAX_DAYS_AHEAD . ' days');
        if ($requestedDate > $maxDate) {
            throw new \InvalidArgumentException('Date cannot be more than 60 days ahead', 422);
        }

        if ($employeeId !== null && $employeeId <= 0) {
            throw new \InvalidArgumentException('Invalid employee_id', 422);
        }
    }

    private function getEmployee(int $employeeId): array
    {
        $employee = $this->employeeRepository->findById($employeeId);
        if (!$employee) {
            throw new \RuntimeException('Employee not found', 404);
        }
        if ($employee['active'] != 1) {
            throw new \RuntimeException('Employee not found', 404);
        }
        return $employee;
    }

    private function isEmployeeOnTimeOff(int $employeeId, string $date): bool
    {
        $timeOffs = $this->employeeRepository->findTimeOffByEmployeeAndDate($employeeId, $date);
        return !empty($timeOffs);
    }

    private function generateSlotsForSchedule(
        array $schedule,
        int $serviceDuration,
        string $date,
        array $appointments,
        bool $isToday,
        DateTimeImmutable $now,
        DateTimeZone $timezone
    ): array {
        $slots = [];
        $startTime = $schedule['start_time'];
        $endTime = $schedule['end_time'];

        $currentTime = new DateTimeImmutable("{$date} {$startTime}", $timezone);
        $scheduleEnd = new DateTimeImmutable("{$date} {$endTime}", $timezone);

        while ($currentTime < $scheduleEnd) {
            $slotEnd = $currentTime->modify("+{$serviceDuration} minutes");

            if ($slotEnd > $scheduleEnd) {
                break;
            }

            if ($isToday) {
                $minStartTime = $now->modify('+' . self::MIN_ADVANCE_MINUTES . ' minutes');
                if ($currentTime < $minStartTime) {
                    $currentTime = $currentTime->modify('+' . self::SLOT_INTERVAL_MINUTES . ' minutes');
                    continue;
                }
            }

            if (!$this->isSlotOverlapping($currentTime, $slotEnd, $appointments)) {
                $slots[] = [
                    'start' => $currentTime->format('Y-m-d H:i'),
                    'end' => $slotEnd->format('Y-m-d H:i')
                ];
            }

            $currentTime = $currentTime->modify('+' . self::SLOT_INTERVAL_MINUTES . ' minutes');
        }

        return $slots;
    }

    private function isSlotOverlapping(
        DateTimeImmutable $slotStart,
        DateTimeImmutable $slotEnd,
        array $appointments
    ): bool {
        $timezone = new DateTimeZone(self::TIMEZONE);

        foreach ($appointments as $appointment) {
            $appointmentStart = new DateTimeImmutable($appointment['scheduled_at'], $timezone);
            $appointmentEnd = new DateTimeImmutable($appointment['ends_at'], $timezone);

            if ($appointmentStart < $slotEnd && $appointmentEnd > $slotStart) {
                return true;
            }
        }

        return false;
    }

    private function deduplicateSlots(array $slots): array
    {
        $uniqueSlots = [];
        $seen = [];

        foreach ($slots as $slot) {
            $key = $slot['start'] . '|' . $slot['end'];
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $uniqueSlots[] = $slot;
            }
        }

        return $uniqueSlots;
    }
}
