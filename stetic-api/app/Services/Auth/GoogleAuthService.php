<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Repositories\MySQL\ClientRepository;
use Core\Auth\JwtHandler;
use Google\Client as GoogleClient;

class GoogleAuthService
{
    public function __construct(private readonly ClientRepository $clientRepository) {}

    public function login(string $credential): array
    {
        $clientId = trim((string) ($_ENV['GOOGLE_CLIENT_ID'] ?? ''));
        if ($clientId === '') {
            throw new \RuntimeException('Google authentication is not configured: GOOGLE_CLIENT_ID is missing');
        }

        $google = new GoogleClient(['client_id' => $clientId]);
        $payload = $google->verifyIdToken($credential);
        if (!is_array($payload) || ($payload['email_verified'] ?? false) !== true || empty($payload['sub']) || empty($payload['email'])) {
            throw new \InvalidArgumentException('Invalid Google credential');
        }

        $client = $this->clientRepository->findByGoogleId((string) $payload['sub']);
        if (!$client) {
            $client = $this->clientRepository->findByEmail((string) $payload['email']);
            if ($client) {
                $this->clientRepository->update((int) $client['id'], ['google_id' => (string) $payload['sub'], 'avatar_url' => $payload['picture'] ?? null]);
                $client = $this->clientRepository->findById((int) $client['id']);
            }
        }
        if (!$client) {
            $id = $this->clientRepository->create(['google_id' => (string) $payload['sub'], 'name' => (string) ($payload['name'] ?? $payload['email']), 'email' => (string) $payload['email'], 'avatar_url' => $payload['picture'] ?? null, 'active' => 1]);
            $client = $this->clientRepository->findById($id);
        }
        if (!$client || !(int) $client['active']) {
            throw new \RuntimeException('Account is disabled');
        }

        $claims = ['sub' => (int) $client['id'], 'email' => $client['email'], 'role' => 'client'];
        return ['token' => JwtHandler::encode($claims), 'refresh_token' => JwtHandler::encodeRefresh($claims), 'client' => $this->publicClient($client)];
    }

    public function publicClient(array $client): array
    {
        return ['id' => (int) $client['id'], 'name' => $client['name'], 'email' => $client['email'], 'phone' => $client['phone'] ?? null, 'avatar_url' => $client['avatar_url'] ?? null];
    }
}
