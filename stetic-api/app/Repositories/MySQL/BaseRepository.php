<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

use Core\Database\Connection;
use mysqli;
use RuntimeException;

abstract class BaseRepository
{
    protected mysqli $db;
    protected string $table;
    protected string $primaryKey = 'id';

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    // ─── CRUD genérico ───────────────────────────────────────────────────────

    public function findAll(array $filters = [], int $limit = 50, int $offset = 0): array
    {
        $where  = '';
        $types  = '';
        $params = [];

        if (!empty($filters)) {
            $clauses = [];
            foreach ($filters as $key => $value) {
                $clauses[] = "`{$key}` = ?";
                $types    .= $this->resolveType($value);
                $params[]  = $value;
            }
            $where = 'WHERE ' . implode(' AND ', $clauses);
        }

        $sql  = "SELECT * FROM `{$this->table}` {$where} LIMIT ? OFFSET ?";
        $types .= 'ii';
        $params[] = $limit;
        $params[] = $offset;

        return $this->fetchAll($sql, $types, $params);
    }

    public function findById(int $id): ?array
    {
        $sql    = "SELECT * FROM `{$this->table}` WHERE `{$this->primaryKey}` = ? LIMIT 1";
        $result = $this->fetchAll($sql, 'i', [$id]);
        return $result[0] ?? null;
    }

    public function create(array $data): int
    {
        $columns = implode(', ', array_map(fn($k) => "`{$k}`", array_keys($data)));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));

        $sql    = "INSERT INTO `{$this->table}` ({$columns}) VALUES ({$placeholders})";
        $types  = implode('', array_map(fn($v) => $this->resolveType($v), array_values($data)));
        $params = array_values($data);

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new RuntimeException('Prepare failed: ' . $this->db->error);
        }

        if ($types) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $id = (int) $this->db->insert_id;
        $stmt->close();

        return $id;
    }

    public function update(int $id, array $data): bool
    {
        $sets   = implode(', ', array_map(fn($k) => "`{$k}` = ?", array_keys($data)));
        $sql    = "UPDATE `{$this->table}` SET {$sets} WHERE `{$this->primaryKey}` = ?";
        $types  = implode('', array_map(fn($v) => $this->resolveType($v), array_values($data))) . 'i';
        $params = [...array_values($data), $id];

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new RuntimeException('Prepare failed: ' . $this->db->error);
        }

        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        return $affected > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare(
            "DELETE FROM `{$this->table}` WHERE `{$this->primaryKey}` = ?"
        );

        if (!$stmt) {
            throw new RuntimeException('Prepare failed: ' . $this->db->error);
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        return $affected > 0;
    }

    public function exists(int $id): bool
    {
        return $this->findById($id) !== null;
    }

    // ─── Helpers internos ────────────────────────────────────────────────────

    protected function fetchAll(string $sql, string $types = '', array $params = []): array
    {
        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new RuntimeException('Prepare failed: ' . $this->db->error);
        }

        if ($types && $params) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $rows   = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $stmt->close();

        return $rows;
    }

    protected function fetchOne(string $sql, string $types = '', array $params = []): ?array
    {
        $rows = $this->fetchAll($sql, $types, $params);
        return $rows[0] ?? null;
    }

    /**
     * Resuelve el tipo MySQLi ('s', 'i', 'd') según el valor PHP.
     */
    protected function resolveType(mixed $value): string
    {
        return match (true) {
            is_int($value)   => 'i',
            is_float($value) => 'd',
            default          => 's',
        };
    }
}
