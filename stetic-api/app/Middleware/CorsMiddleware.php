<?php

declare(strict_types=1);

namespace App\Middleware;

use Core\Http\Request;
use Core\Http\Response;

class CorsMiddleware
{
    public function handle(Request $request, Response $response, callable $next): void
    {
        header('Access-Control-Allow-Origin: '  . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
        header('Access-Control-Allow-Methods: ' . ($_ENV['CORS_ALLOWED_METHODS'] ?? 'GET,POST,PUT,PATCH,DELETE,OPTIONS'));
        header('Access-Control-Allow-Headers: ' . ($_ENV['CORS_ALLOWED_HEADERS'] ?? 'Content-Type,Authorization'));

        if ($request->method() === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $next();
    }
}
