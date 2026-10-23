<?php

declare(strict_types=1);

namespace App\Controllers\Appointments;

use App\Services\Appointments\AppointmentService;
use App\Repositories\MySQL\AppointmentRepository;
use App\Repositories\MySQL\ClientRepository;
use App\Repositories\MySQL\ServiceRepository;
use App\Repositories\MySQL\EmployeeRepository;
use Core\Http\Request;
use Core\Http\Response;

class AppointmentController
{
    private AppointmentService $appointmentService;

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {
        $this->appointmentService = new AppointmentService(
            new AppointmentRepository(),
            new ClientRepository(),
            new ServiceRepository(),
            new EmployeeRepository(),
        );
    }

    /** GET /api/client/appointments */
    public function clientIndex(): void
    {
        $auth = $this->request->param('auth_user');
        $this->response->success($this->appointmentService->getByClient((int) ($auth['sub'] ?? 0)));
    }

    /** PATCH /api/client/appointments/{id}/status */
    public function clientStatus(): void
    {
        try {
            $auth = $this->request->param('auth_user');
            $data = $this->appointmentService->setClientStatus(
                (int) $this->request->param('id'),
                (string) $this->request->input('status'),
                (int) ($auth['sub'] ?? 0)
            );
            $this->response->success($data, 'Appointment updated');
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }

    /** GET /api/appointments */
    public function index(): void
    {
        $from       = $this->request->query('from');
        $to         = $this->request->query('to');
        $employeeId = $this->request->query('employee_id');

        if ($from && $to) {
            $data = $this->appointmentService->getByDateRange($from, $to, $employeeId ? (int) $employeeId : null);
        } else {
            $data = $this->appointmentService->getAll();
        }

        $this->response->success($data);
    }

    /** GET /api/appointments/{id} */
    public function show(): void
    {
        try {
            $data = $this->appointmentService->getById((int) $this->request->param('id'));
            $this->response->success($data);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }

    /** POST /api/appointments */
    public function store(): void
    {
        try {
            $data = $this->appointmentService->create($this->request->body());
            $this->response->success($data, 'Appointment created', 201);
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        }
    }

    /** PUT /api/appointments/{id} */
    public function update(): void
    {
        try {
            $data = $this->appointmentService->update(
                (int) $this->request->param('id'),
                $this->request->body()
            );
            $this->response->success($data, 'Appointment updated');
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }

    /** DELETE /api/appointments/{id} */
    public function cancel(): void
    {
        try {
            $this->appointmentService->cancel((int) $this->request->param('id'));
            $this->response->success(null, 'Appointment cancelled');
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }
}
