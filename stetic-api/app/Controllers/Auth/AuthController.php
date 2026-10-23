<?php

declare(strict_types=1);

namespace App\Controllers\Auth;

use App\Services\Auth\AuthService;
use App\Repositories\MySQL\UserRepository;
use Core\Http\Request;
use Core\Http\Response;

class AuthController
{
    private AuthService $authService;

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {
        $this->authService = new AuthService(new UserRepository());
    }

    /**
     * POST /api/auth/login
     */
    public function login(): void
    {
        $body = $this->request->body();

        if (empty($body['email']) || empty($body['password'])) {
            $this->response->error('Email and password are required', 422);
        }

        try {
            $result = $this->authService->login($body['email'], $body['password']);
            $this->response->success($result, 'Login successful');
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 401);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), 403);
        }
    }

    /**
     * POST /api/auth/register
     */
    public function register(): void
    {
        $body = $this->request->body();

        try {
            $user = $this->authService->register($body);
            $this->response->success($user, 'User registered', 201);
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 422);
        }
    }

    /**
     * GET /api/auth/me
     */
    public function me(): void
    {
        $authUser = $this->request->param('auth_user');
        $this->response->success($authUser);
    }
}
