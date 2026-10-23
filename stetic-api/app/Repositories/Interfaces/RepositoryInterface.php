<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

interface RepositoryInterface
{
    public function findAll(array $filters = [], int $limit = 50, int $offset = 0): array;
    public function findById(int $id): ?array;
    public function create(array $data): int;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
