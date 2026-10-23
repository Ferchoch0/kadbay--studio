<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\Auth\GoogleAuthService;
use App\Repositories\MySQL\ClientRepository;
use Core\Http\Request;
use Core\Http\Response;

class ClientAuthController
{
    private GoogleAuthService $service;

    public function __construct(private readonly Request $request, private readonly Response $response)
    {
        $this->service = new GoogleAuthService(new ClientRepository());
    }

    public function google(): void
    {
        $credential = $this->request->input('credential');
        if (!is_string($credential) || trim($credential) === '') {
            $this->response->error('Google credential is required', 422);
        }
        try {
            $this->response->success($this->service->login($credential), 'Login successful');
        } catch (\InvalidArgumentException $e) {
            $this->response->error($e->getMessage(), 401);
        } catch (\RuntimeException $e) {
            $this->response->error($e->getMessage(), str_contains($e->getMessage(), 'not configured') ? 500 : 403);
        } catch (\Throwable) {
            $this->response->error('Invalid Google credential', 401);
        }
    }

    public function me(): void
    {
        $auth = $this->request->param('auth_user');
        $client = (new ClientRepository())->findById((int) ($auth['sub'] ?? 0));
        if (!$client || !(int) $client['active']) {
            $this->response->error('Client not found', 404);
        }
        $this->response->success(['id' => (int) $client['id'], 'name' => $client['name'], 'email' => $client['email'], 'phone' => $client['phone'] ?? null, 'avatar_url' => $client['avatar_url'] ?? null]);
    }
}
