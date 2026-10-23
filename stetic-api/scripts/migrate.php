<?php

declare(strict_types=1);

define('BASE_PATH', dirname(__DIR__));

require_once BASE_PATH . '/vendor/autoload.php';

use Core\Database\Connection;
use Database\Migrations\Migration;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

// Configure database connection
Connection::configure([
    'host'     => $_ENV['DB_HOST']     ?? '127.0.0.1',
    'port'     => $_ENV['DB_PORT']     ?? '3306',
    'database' => $_ENV['DB_DATABASE'] ?? 'stetic_db',
    'username' => $_ENV['DB_USERNAME'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
]);

$db = Connection::getInstance();

echo "=== Stetic API - Database Migrations ===\n\n";

// Create migrations table if not exists
echo "Checking migrations table...\n";
$db->query("
    CREATE TABLE IF NOT EXISTS migrations (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        migration  VARCHAR(255) NOT NULL UNIQUE,
        batch      INT UNSIGNED NOT NULL,
        executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

if ($db->errno) {
    die("Error creating migrations table: {$db->error}\n");
}

echo "✓ Migrations table ready\n\n";

// Get already executed migrations
$result = $db->query("SELECT migration FROM migrations ORDER BY migration");
$executed = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $executed[] = $row['migration'];
    }
    $result->free();
}

// Scan migration files
$migrationsPath = BASE_PATH . '/database/migrations';
$files = glob($migrationsPath . '/*.php');

if (!$files) {
    die("No migration files found in {$migrationsPath}\n");
}

// Filter and sort migration files (exclude Migration.php base class)
$migrationFiles = array_filter($files, function ($file) {
    return basename($file) !== 'Migration.php';
});

sort($migrationFiles);

// Determine next batch number
$batchResult = $db->query("SELECT COALESCE(MAX(batch), 0) as last_batch FROM migrations");
$lastBatch = 0;

if ($batchResult) {
    $row = $batchResult->fetch_assoc();
    $lastBatch = (int) $row['last_batch'];
    $batchResult->free();
}

$currentBatch = $lastBatch + 1;
$migrationsRan = 0;

echo "Scanning for pending migrations...\n";

foreach ($migrationFiles as $file) {
    $filename = basename($file, '.php');
    
    // Skip if already executed
    if (in_array($filename, $executed, true)) {
        echo "  - {$filename} (already executed)\n";
        continue;
    }

    echo "  → Running {$filename}...\n";

    // Load migration class
    require_once $file;

    // Extract class name from filename
    // Format: 2024_01_01_001_create_users_table.php -> CreateUsersTable
    $parts = explode('_', $filename);
    $className = implode('', array_map('ucfirst', array_slice($parts, 4)));

    if (!class_exists($className)) {
        echo "    ✗ Error: Class {$className} not found in {$filename}\n";
        continue;
    }

    try {
        $migration = new $className($db);

        if (!($migration instanceof Migration)) {
            echo "    ✗ Error: {$className} must extend Database\\Migrations\\Migration\n";
            continue;
        }

        // Execute up() method
        $migration->up();

        // Record migration
        $stmt = $db->prepare("INSERT INTO migrations (migration, batch) VALUES (?, ?)");
        $stmt->bind_param('si', $filename, $currentBatch);
        $stmt->execute();
        $stmt->close();

        echo "    ✓ Migrated successfully\n";
        $migrationsRan++;
    } catch (Throwable $e) {
        echo "    ✗ Error: {$e->getMessage()}\n";
        echo "\nMigration failed. Rolling back batch {$currentBatch}...\n";
        
        // Rollback current batch
        $db->query("DELETE FROM migrations WHERE batch = {$currentBatch}");
        
        exit(1);
    }
}

echo "\n";

if ($migrationsRan > 0) {
    echo "✓ Executed {$migrationsRan} migration(s) in batch {$currentBatch}\n";
} else {
    echo "✓ No pending migrations\n";
}

echo "\nDone.\n";
