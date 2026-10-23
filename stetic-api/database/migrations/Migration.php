<?php

declare(strict_types=1);

namespace Database\Migrations;

use mysqli;
use RuntimeException;

abstract class Migration
{
    protected mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    abstract public function up(): void;

    abstract public function down(): void;

    protected function execute(string $sql): void
    {
        $result = $this->db->multi_query(trim($sql));

        if (!$result) {
            throw new RuntimeException(
                "Migration failed: {$this->db->error}"
            );
        }

        // Clear all results from multi_query
        while ($this->db->more_results() && $this->db->next_result()) {
            if ($res = $this->db->store_result()) {
                $res->free();
            }
        }

        if ($this->db->errno) {
            throw new RuntimeException(
                "Migration failed: {$this->db->error}"
            );
        }
    }
}
