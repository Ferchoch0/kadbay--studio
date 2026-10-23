<?php

declare(strict_types=1);

namespace App\Controllers\Availability;

use App\Services\Availability\AvailabilityService;
use App\Repositories\MySQL\EmployeeRepository;
use App\Repositories\MySQL\ServiceRepository;
use Core\Http\Request;
use Core\Http\Response;

class AvailabilityController
{
    private AvailabilityService $availabilityService;

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {
        $this->availabilityService = new AvailabilityService(
            new EmployeeRepository(),
            new ServiceRepository()
        );
    }

    public function index(): void
    {
        try {
            $serviceId = $this->request->query('service_id');
            $date = $this->request->query('date');
            $employeeId = $this->request->query('employee_id');

            if (!$serviceId) {
                $this->response->error('service_id is required', 422);
                return;
            }

            if (!$date) {
                $this->response->error('date is required', 422);
                return;
            }

            $slots = $this->availabilityService->getAvailableSlots(
                (int) $serviceId,
                (string) $date,
                $employeeId ? (int) $employeeId : null
            );

            $this->response->success($slots);
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }
}
