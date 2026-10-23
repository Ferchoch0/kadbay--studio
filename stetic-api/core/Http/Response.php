<?php

declare(strict_types=1);

namespace Core\Http;

class Response
{
    private int   $statusCode = 200;
    private array $headers    = [];

    public function __construct()
    {
        $this->withHeader('Content-Type', 'application/json');
    }

    public function withStatus(int $code): static
    {
        $this->statusCode = $code;
        return $this;
    }

    public function withHeader(string $key, string $value): static
    {
        $this->headers[$key] = $value;
        return $this;
    }

    public function json(mixed $data, ?int $statusCode = null): void
    {
        if ($statusCode !== null) {
            $this->statusCode = $statusCode;
        }

        $this->sendHeaders();
        http_response_code($this->statusCode);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function success(mixed $data = null, string $message = 'OK', int $code = 200): void
    {
        $this->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public function error(string $message, int $code = 400, mixed $errors = null): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        $this->json($payload, $code);
    }

    public function noContent(): void
    {
        $this->sendHeaders();
        http_response_code(204);
        exit;
    }

    private function sendHeaders(): void
    {
        foreach ($this->headers as $key => $value) {
            header("{$key}: {$value}");
        }
    }
}
