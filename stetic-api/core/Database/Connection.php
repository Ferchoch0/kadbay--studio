<?php

declare(strict_types=1);

namespace Core\Database;

use mysqli;
use mysqli_result;
use RuntimeException;

class Connection
{
    private static ?mysqli $instance = null;
    private static array   $config   = [];

    public static function configure(array $config): void
    {
        self::$config = $config;
    }

    public static function getInstance(): mysqli
    {
        if (self::$instance === null) {
            self::$instance = self::createConnection();
        }
        return self::$instance;
    }

    private static function createConnection(): mysqli
    {
        $cfg = self::$config;

        // Suprimir advertencias nativas para manejar el error manualmente
        $mysqli = @new mysqli(
            $cfg['host']     ?? '127.0.0.1',
            $cfg['username'] ?? 'root',
            $cfg['password'] ?? '',
            $cfg['database'] ?? 'stetic_db',
            (int) ($cfg['port'] ?? 3306)
        );

        if ($mysqli->connect_error) {
            throw new RuntimeException(
                'Database connection failed: ' . $mysqli->connect_error
            );
        }

        // Charset UTF-8
        $mysqli->set_charset('utf8mb4');

        return $mysqli;
    }

    /**
     * Ejecuta una query preparada con parámetros y devuelve el resultado.
     *
     * @param  string $sql    Query con placeholders (?)
     * @param  string $types  Tipos: 's' string, 'i' int, 'd' double, 'b' blob
     * @param  array  $params Valores a bindear
     */
    public static function query(string $sql, string $types = '', array $params = []): mysqli_result|bool
    {
        $db   = self::getInstance();
        $stmt = $db->prepare($sql);

        if (!$stmt) {
            throw new RuntimeException('Query prepare failed: ' . $db->error);
        }

        if ($types && $params) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();

        $result = $stmt->get_result();
        $stmt->close();

        return $result !== false ? $result : true;
    }

    // Evitar clonación
    private function __clone() {}
}
