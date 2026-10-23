<?php

declare(strict_types=1);

namespace App\Middleware;

use Core\Http\Request;
use Core\Http\Response;
use Core\Auth\JwtHandler;

class AuthMiddleware
{
    protected function allowedRoles(): array
    {
        return ['admin', 'staff'];
    }

    public function handle(Request $request, Response $response, callable $next): void
    {
        $token = $request->bearerToken();

        if (!$token) {
            $response->error('Unauthorized: No token provided', 401);
        }

        try {
            $payload = JwtHandler::decode($token);
            $role = $payload['role'] ?? null;
            if (!in_array($role, $this->allowedRoles(), true)) {
                $response->error('Forbidden: Insufficient role', 403);
            }
            $request->setParams(['auth_user' => $payload]);
        } catch (\Exception $e) {
            $response->error('Unauthorized: ' . $e->getMessage(), 401);
        }

        $next();
    }
}
