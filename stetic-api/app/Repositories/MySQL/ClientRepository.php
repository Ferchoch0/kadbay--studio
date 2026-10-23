<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

class ClientRepository extends BaseRepository
{
    protected string $table = 'clients';

    public function findByGoogleId(string $googleId): ?array
    {
        return $this->fetchOne(
            "SELECT * FROM `{$this->table}` WHERE google_id = ? LIMIT 1",
            's',
            [$googleId]
        );
    }

    public function findByEmail(string $email): ?array
    {
        return $this->fetchOne(
            "SELECT * FROM `{$this->table}` WHERE email = ? LIMIT 1",
            's',
            [$email]
        );
    }

    public function updatePhoneIfEmpty(int $id, string $phone): void
    {
        $stmt = $this->db->prepare("UPDATE `{$this->table}` SET phone = ? WHERE id = ? AND (phone IS NULL OR phone = '')");
        if (!$stmt) throw new \RuntimeException('Prepare failed: ' . $this->db->error);
        $stmt->bind_param('si', $phone, $id);
        $stmt->execute();
        $stmt->close();
    }

    public function search(string $term, int $limit = 20): array
    {
        $like = "%{$term}%";
        return $this->fetchAll(
            "SELECT * FROM `{$this->table}`
             WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
             LIMIT ?",
            'sssi',
            [$like, $like, $like, $limit]
        );
    }
}
