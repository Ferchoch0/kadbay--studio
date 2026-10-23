<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Repositories\MySQL\UserRepository;
use Core\Auth\JwtHandler;

class AuthService
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            throw new \InvalidArgumentException('Invalid credentials');
        }

        if (!$user['active']) {
            throw new \RuntimeException('Account is disabled');
        }

        $payload = [
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ];

        return [
            'user'          => $this->sanitizeUser($user),
            'access_token'  => JwtHandler::encode($payload),
            'refresh_token' => JwtHandler::encodeRefresh($payload),
            'token_type'    => 'Bearer',
        ];
    }

    public function register(array $data): array
    {
        $existing = $this->userRepository->findByEmail($data['email']);

        if ($existing) {
            throw new \InvalidArgumentException('Email already registered');
        }

        $id = $this->userRepository->create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'       => $data['role'] ?? 'staff',
            'active'     => 1,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->userRepository->findById($id);
    }

    private function sanitizeUser(array $user): array
    {
        unset($user['password']);
        return $user;
    }
}
