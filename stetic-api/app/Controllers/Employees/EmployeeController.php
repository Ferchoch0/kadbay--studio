<?php

declare(strict_types=1);

namespace App\Controllers\Employees;

use App\Repositories\MySQL\EmployeeRepository;
use Core\Http\Request;
use Core\Http\Response;

class EmployeeController
{
    private EmployeeRepository $employeeRepository;

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {
        $this->employeeRepository = new EmployeeRepository();
    }

    public function index(): void
    {
        $employees = $this->employeeRepository->findActivePublic();
        $this->response->success($employees);
    }

    public function show(): void
    {
    }

    public function store(): void
    {
    }

    public function update(): void
    {
    }

    public function destroy(): void
    {
    }
}
