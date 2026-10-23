<?php

declare(strict_types=1);

namespace Core\Http;

class Request
{
    private array $params = [];
    private array $body   = [];
    private array $query  = [];

    public function __construct()
    {
        $this->body  = $this->parseBody();
        $this->query = $_GET ?? [];
    }

    public function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public function uri(): string
    {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        return rtrim($uri, '/') ?: '/';
    }

    public function body(): array
    {
        return $this->body;
    }

    public function query(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $this->query;
        }
        return $this->query[$key] ?? $default;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    public function param(string $key, mixed $default = null): mixed
    {
        return $this->params[$key] ?? $default;
    }

    public function setParams(array $params): void
    {
        // Preserve route parameters when middleware adds values such as auth_user.
        $this->params = array_merge($this->params, $params);
    }

    public function header(string $key): ?string
    {
        $headerKey = 'HTTP_' . strtoupper(str_replace('-', '_', $key));
        $value = $_SERVER[$headerKey] ?? null;

        // Apache/FastCGI may expose Authorization through a different source.
        if ($value === null && strtoupper($key) === 'AUTHORIZATION') {
            $value = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

            if ($value === null && function_exists('getallheaders')) {
                $headers = getallheaders();
                foreach ($headers as $name => $headerValue) {
                    if (strcasecmp($name, 'Authorization') === 0) {
                        $value = $headerValue;
                        break;
                    }
                }
            }
        }

        return is_string($value) ? $value : null;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('Authorization');
        if ($auth && preg_match('/^Bearer\s+(.+)$/i', trim($auth), $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    public function isJson(): bool
    {
        return str_contains($this->header('Content-Type') ?? '', 'application/json');
    }

    private function parseBody(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            return json_decode($raw, true) ?? [];
        }

        return $_POST ?? [];
    }
}
