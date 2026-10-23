<?php

declare(strict_types=1);

namespace Core\Router;

use Core\Http\Request;
use Core\Http\Response;

class Router
{
    private array $routes = [];
    private array $middlewares = [];

    public function __construct(
        private readonly Request  $request,
        private readonly Response $response
    ) {}

    public function get(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function put(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function patch(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->addRoute('PATCH', $path, $handler, $middleware);
    }

    public function delete(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    public function group(string $prefix, callable $callback, array $middleware = []): void
    {
        $callback(new GroupRouter($this, $prefix, $middleware));
    }

    private function addRoute(string $method, string $path, callable|array $handler, array $middleware): void
    {
        $this->routes[] = [
            'method'     => $method,
            'path'       => $path,
            'handler'    => $handler,
            'middleware' => $middleware,
            'pattern'    => $this->pathToRegex($path),
        ];
    }

    private function pathToRegex(string $path): string
    {
        return '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $path) . '$#';
    }

    public function dispatch(): void
    {
        $method = $this->request->method();
        $uri    = $this->request->uri();

        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
            header('Access-Control-Allow-Methods: ' . ($_ENV['CORS_ALLOWED_METHODS'] ?? 'GET,POST,PUT,PATCH,DELETE,OPTIONS'));
            header('Access-Control-Allow-Headers: ' . ($_ENV['CORS_ALLOWED_HEADERS'] ?? 'Content-Type,Authorization'));
            http_response_code(200);
            exit;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['pattern'], $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $this->request->setParams($params);

                // Run middleware chain
                $this->runMiddlewares($route['middleware'], function () use ($route) {
                    $this->callHandler($route['handler']);
                });

                return;
            }
        }

        $this->response->json(['error' => 'Route not found'], 404);
    }

    private function runMiddlewares(array $middlewares, callable $next): void
    {
        if (empty($middlewares)) {
            $next();
            return;
        }

        $middleware = array_shift($middlewares);
        $instance   = new $middleware();
        $instance->handle($this->request, $this->response, function () use ($middlewares, $next) {
            $this->runMiddlewares($middlewares, $next);
        });
    }

    private function callHandler(callable|array $handler): void
    {
        if (is_callable($handler)) {
            $handler($this->request, $this->response);
            return;
        }

        [$class, $method] = $handler;
        $controller = new $class($this->request, $this->response);
        $controller->$method();
    }
}
