<?php

declare(strict_types=1);

namespace App\Repositories\MySQL;

class UserRepository extends BaseRepository
{
    protected string $table = 'users';

    public function findByEmail(string $email): ?array
    {
        return $this->fetchOne(
            "SELECT * FROM `{$this->table}` WHERE email = ? LIMIT 1",
            's',
            [$email]
        );
    }

    public function updatePassword(int $id, string $hashedPassword): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE `{$this->table}` SET password = ?, updated_at = NOW() WHERE id = ?"
        );

        if (!$stmt) {
            throw new \RuntimeException('Prepare failed: ' . $this->db->error);
        }

        $stmt->bind_param('si', $hashedPassword, $id);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        return $affected > 0;
    }
}
