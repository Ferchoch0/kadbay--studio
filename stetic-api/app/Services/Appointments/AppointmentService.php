<?php

declare(strict_types=1);

namespace App\Services\Appointments;

use App\Repositories\MySQL\AppointmentRepository;
use App\Repositories\MySQL\ClientRepository;
use App\Repositories\MySQL\ServiceRepository;
use App\Repositories\MySQL\EmployeeRepository;

class AppointmentService
{
    public function __construct(
        private readonly AppointmentRepository $appointmentRepository,
        private readonly ClientRepository      $clientRepository,
        private readonly ServiceRepository     $serviceRepository,
        private readonly EmployeeRepository    $employeeRepository,
    ) {}

    public function getAll(array $filters = []): array
    {
        return $this->appointmentRepository->findAll($filters);
    }

    public function getById(int $id): array
    {
        $appointment = $this->appointmentRepository->findById($id);

        if (!$appointment) {
            throw new \RuntimeException('Appointment not found', 404);
        }

        return $appointment;
    }

    public function create(array $data): array
    {
        $this->validateRelations($data);
        $service = $this->serviceRepository->findById((int) $data['service_id']);
        $scheduledAt = new \DateTimeImmutable($data['scheduled_at']);
        $data['ends_at'] = $scheduledAt->modify('+' . (int) $service['duration'] . ' minutes')->format('Y-m-d H:i:s');
        if (!empty($data['phone_number'])) {
            $this->clientRepository->updatePhoneIfEmpty((int) $data['client_id'], trim((string) $data['phone_number']));
        }

        $id = $this->appointmentRepository->create([
            'client_id'    => $data['client_id'],
            'service_id'   => $data['service_id'],
            'employee_id'  => $data['employee_id'],
            'scheduled_at' => $data['scheduled_at'],
            'ends_at'      => $data['ends_at'],
            'notes'        => $data['notes'] ?? null,
            'status'       => 'pending',
            'created_at'   => date('Y-m-d H:i:s'),
        ]);

        return $this->appointmentRepository->findById($id);
    }

    public function update(int $id, array $data): array
    {
        if (!$this->appointmentRepository->exists($id)) {
            throw new \RuntimeException('Appointment not found', 404);
        }

        $this->appointmentRepository->update($id, $data);
        return $this->appointmentRepository->findById($id);
    }

    public function cancel(int $id): bool
    {
        if (!$this->appointmentRepository->exists($id)) {
            throw new \RuntimeException('Appointment not found', 404);
        }

        return $this->appointmentRepository->update($id, [
            'status'     => 'cancelled',
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function getByClient(int $clientId): array
    {
        return $this->appointmentRepository->findByClient($clientId);
    }

    public function setClientStatus(int $id, string $status, int $clientId): array
    {
        $appointment = $this->appointmentRepository->findById($id);
        if (!$appointment || (int) $appointment['client_id'] !== $clientId) {
            throw new \RuntimeException('Appointment not found', 404);
        }
        if (!in_array($status, ['confirmed', 'cancelled'], true)) {
            throw new \InvalidArgumentException('Invalid appointment status');
        }
        $this->appointmentRepository->update($id, ['status' => $status, 'updated_at' => date('Y-m-d H:i:s')]);
        $updated = $this->appointmentRepository->findByIdWithDetails($id);
        if (!$updated) {
            throw new \RuntimeException('Appointment not found', 404);
        }
        return $updated;
    }

    public function getByDateRange(string $from, string $to, ?int $employeeId = null): array
    {
        return $this->appointmentRepository->findByDateRange($from, $to, $employeeId);
    }

    private function validateRelations(array $data): void
    {
        if (!$this->clientRepository->exists((int) $data['client_id'])) {
            throw new \InvalidArgumentException('Client not found');
        }
        if (!$this->serviceRepository->exists((int) $data['service_id'])) {
            throw new \InvalidArgumentException('Service not found');
        }
        if (!$this->employeeRepository->exists((int) $data['employee_id'])) {
            throw new \InvalidArgumentException('Employee not found');
        }
    }
}
