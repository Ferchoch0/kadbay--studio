<?php

declare(strict_types=1);

namespace Core\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler
{
    private static string $algorithm = 'HS256';

    public static function encode(array $payload): string
    {
        $payload['iat'] = time();
        // Keep client sessions alive for seven days by default. This can still be
        // overridden with JWT_EXPIRATION in the API environment.
        $payload['exp'] = time() + (int) ($_ENV['JWT_EXPIRATION'] ?? 604800);

        return JWT::encode($payload, self::secret(), self::$algorithm);
    }

    public static function decode(string $token): array
    {
        $decoded = JWT::decode($token, new Key(self::secret(), self::$algorithm));
        return (array) $decoded;
    }

    public static function encodeRefresh(array $payload): string
    {
        $payload['iat'] = time();
        $payload['exp'] = time() + (int) ($_ENV['JWT_REFRESH_EXPIRATION'] ?? 604800);

        return JWT::encode($payload, self::secret(), self::$algorithm);
    }

    private static function secret(): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? null;

        if (!$secret) {
            throw new \RuntimeException('JWT_SECRET is not configured');
        }

        return $secret;
    }
}
