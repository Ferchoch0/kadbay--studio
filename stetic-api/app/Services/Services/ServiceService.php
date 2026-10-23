<?php

declare(strict_types=1);

namespace App\Services\Services;

use App\Repositories\MySQL\ServiceRepository;

class ServiceService
{
    private const ALLOWED_FIELDS = [
        'name',
        'description',
        'category',
        'image_url',
        'duration',
        'price',
        'active',
    ];

    private const PUBLIC_FIELDS = [
        'id',
        'name',
        'description',
        'category',
        'image_url',
        'duration',
        'price',
    ];

    public function __construct(
        private readonly ServiceRepository $serviceRepository
    ) {}

    public function getAllActive(): array
    {
        $services = $this->serviceRepository->findActive();
        return array_map(fn($service) => $this->formatPublicResponse($service), $services);
    }

    public function getByIdPublic(int $id): array
    {
        $service = $this->serviceRepository->findById($id);

        if (!$service) {
            throw new \RuntimeException('Service not found', 404);
        }

        if ($service['active'] != 1) {
            throw new \RuntimeException('Service not found', 404);
        }

        return $this->formatPublicResponse($service);
    }

    public function create(array $data): array
    {
        $this->validateData($data);
        $filtered = $this->filterAllowedFields($data);
        
        $filtered['created_at'] = date('Y-m-d H:i:s');
        
        $id = $this->serviceRepository->create($filtered);
        return $this->serviceRepository->findById($id);
    }

    public function update(int $id, array $data): array
    {
        if (!$this->serviceRepository->exists($id)) {
            throw new \RuntimeException('Service not found', 404);
        }

        $this->validateData($data, isUpdate: true);
        $filtered = $this->filterAllowedFields($data);
        
        $this->serviceRepository->update($id, $filtered);
        return $this->serviceRepository->findById($id);
    }

    public function deactivate(int $id): bool
    {
        if (!$this->serviceRepository->exists($id)) {
            throw new \RuntimeException('Service not found', 404);
        }

        return $this->serviceRepository->update($id, [
            'active'     => 0,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    private function validateData(array $data, bool $isUpdate = false): void
    {
        if (!$isUpdate && empty($data['name'])) {
            throw new \InvalidArgumentException('Name is required');
        }

        if (isset($data['name'])) {
            if (!is_string($data['name'])) {
                throw new \InvalidArgumentException('Name must be a string');
            }
            if (strlen($data['name']) > 255) {
                throw new \InvalidArgumentException('Name must not exceed 255 characters');
            }
        }

        if (isset($data['duration'])) {
            if (!is_numeric($data['duration']) || (int) $data['duration'] <= 0) {
                throw new \InvalidArgumentException('Duration must be an integer greater than 0');
            }
        }

        if (isset($data['price'])) {
            if (!is_numeric($data['price']) || (float) $data['price'] < 0) {
                throw new \InvalidArgumentException('Price must be a number greater than or equal to 0');
            }
        }

        if (isset($data['active'])) {
            if (!is_bool($data['active']) && $data['active'] !== 0 && $data['active'] !== 1) {
                throw new \InvalidArgumentException('Active must be a boolean');
            }
        }
    }

    private function filterAllowedFields(array $data): array
    {
        $filtered = [];
        
        foreach (self::ALLOWED_FIELDS as $field) {
            if (array_key_exists($field, $data)) {
                $filtered[$field] = $data[$field];
            }
        }
        
        return $filtered;
    }

    private function formatPublicResponse(array $service): array
    {
        $public = [];
        
        foreach (self::PUBLIC_FIELDS as $field) {
            $public[$field] = $service[$field] ?? null;
        }
        
        return $public;
    }
}
