<?php

declare(strict_types=1);

namespace App\Exceptions;

use Core\Http\Response;
use Throwable;

class Handler
{
    public static function register(): void
    {
        set_exception_handler([self::class, 'handleException']);
        set_error_handler([self::class, 'handleError']);
    }

    public static function handleException(Throwable $e): void
    {
        $debug  = ($_ENV['APP_DEBUG'] ?? 'false') === 'true';
        $code   = method_exists($e, 'getCode') ? (int) $e->getCode() : 500;
        $status = ($code >= 400 && $code < 600) ? $code : 500;

        $payload = [
            'success' => false,
            'message' => $e->getMessage() ?: 'Internal server error',
        ];

        if ($debug) {
            $payload['trace'] = $e->getTraceAsString();
            $payload['file']  = $e->getFile();
            $payload['line']  = $e->getLine();
        }

        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function handleError(int $errno, string $errstr, string $errfile, int $errline): bool
    {
        throw new \ErrorException($errstr, $errno, $errno, $errfile, $errline);
    }
}
