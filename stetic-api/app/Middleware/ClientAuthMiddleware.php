<?php

declare(strict_types=1);

namespace App\Middleware;

class ClientAuthMiddleware extends AuthMiddleware
{
    protected function allowedRoles(): array
    {
        return ['client'];
    }
}
