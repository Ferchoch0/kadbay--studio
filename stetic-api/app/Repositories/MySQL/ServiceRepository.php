<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

class ServiceRepository extends BaseRepository
{
    protected string $table = 'services';

    public function findActive(): array
    {
        return $this->fetchAll(
            "SELECT * FROM `{$this->table}` WHERE active = 1 ORDER BY name ASC"
        );
    }

    public function findByCategory(string $category): array
    {
        return $this->fetchAll(
            "SELECT * FROM `{$this->table}` WHERE category = ? AND active = 1 ORDER BY name ASC",
            's',
            [$category]
        );
    }
}
