<?php

declare(strict_types=1);

namespace App\Controllers\Services;

use App\Services\Services\ServiceService;
use App\Repositories\MySQL\ServiceRepository;
use Core\Http\Request;
use Core\Http\Response;

class ServiceController
{
    private ServiceService $serviceService;

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {
        $this->serviceService = new ServiceService(new ServiceRepository());
    }

    public function index(): void
    {
        $data = $this->serviceService->getAllActive();
        $this->response->success($data);
    }

    public function show(): void
    {
        try {
            $id = (int) $this->request->param('id');
            $data = $this->serviceService->getByIdPublic($id);
            $this->response->success($data);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }

    public function store(): void
    {
        try {
            $data = $this->serviceService->create($this->request->body());
            $this->response->success($data, 'Service created', 201);
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        }
    }

    public function update(): void
    {
        try {
            $id = (int) $this->request->param('id');
            $data = $this->serviceService->update($id, $this->request->body());
            $this->response->success($data, 'Service updated');
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        }
    }

    public function destroy(): void
    {
        try {
            $id = (int) $this->request->param('id');
            $this->serviceService->deactivate($id);
            $this->response->success(null, 'Service deactivated');
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 404);
        }
    }
}
