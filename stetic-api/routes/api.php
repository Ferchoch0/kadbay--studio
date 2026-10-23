<?php

declare(strict_types=1);

use Core\Router\Router;
use App\Controllers\Auth\AuthController;
use App\Controllers\Clients\ClientController;
use App\Controllers\Appointments\AppointmentController;
use App\Controllers\Services\ServiceController;
use App\Controllers\Employees\EmployeeController;
use App\Controllers\Availability\AvailabilityController;
use App\Middleware\AuthMiddleware;
use App\Middleware\CorsMiddleware;
use App\Middleware\ClientAuthMiddleware;
use App\Controllers\ClientAuthController;

/** @var Router $router */

// ─── Auth (public) ───────────────────────────────────────────────────────────
$router->post('/api/auth/login',    [AuthController::class, 'login'],    [CorsMiddleware::class]);
$router->post('/api/auth/register', [AuthController::class, 'register'], [CorsMiddleware::class]);
$router->post('/api/auth/google', [ClientAuthController::class, 'google'], [CorsMiddleware::class]);
$router->get('/api/client/me', [ClientAuthController::class, 'me'], [CorsMiddleware::class, ClientAuthMiddleware::class]);
$router->get('/api/client/appointments', [AppointmentController::class, 'clientIndex'], [CorsMiddleware::class, ClientAuthMiddleware::class]);
$router->patch('/api/client/appointments/{id}/status', [AppointmentController::class, 'clientStatus'], [CorsMiddleware::class, ClientAuthMiddleware::class]);

// ─── Protected routes ────────────────────────────────────────────────────────
$auth = [CorsMiddleware::class, AuthMiddleware::class];

$router->get('/api/auth/me', [AuthController::class, 'me'], $auth);

// Clients
$router->get('/api/clients',        [ClientController::class, 'index'],   $auth);
$router->get('/api/clients/{id}',   [ClientController::class, 'show'],    $auth);
$router->post('/api/clients',       [ClientController::class, 'store'],   $auth);
$router->put('/api/clients/{id}',   [ClientController::class, 'update'],  $auth);
$router->delete('/api/clients/{id}',[ClientController::class, 'destroy'], $auth);

// Appointments
$router->get('/api/appointments',          [AppointmentController::class, 'index'],  $auth);
$router->get('/api/appointments/{id}',     [AppointmentController::class, 'show'],   $auth);
$router->post('/api/appointments',         [AppointmentController::class, 'store'],  [CorsMiddleware::class, ClientAuthMiddleware::class]);
$router->put('/api/appointments/{id}',     [AppointmentController::class, 'update'], $auth);
$router->delete('/api/appointments/{id}',  [AppointmentController::class, 'cancel'], $auth);

// Services
$router->get('/api/services',        [ServiceController::class, 'index'],   [CorsMiddleware::class]);
$router->get('/api/services/{id}',   [ServiceController::class, 'show'],    [CorsMiddleware::class]);
$router->post('/api/services',       [ServiceController::class, 'store'],   $auth);
$router->put('/api/services/{id}',   [ServiceController::class, 'update'],  $auth);
$router->delete('/api/services/{id}',[ServiceController::class, 'destroy'], $auth);

// Employees (public index)
$router->get('/api/employees',         [EmployeeController::class, 'index'],   [CorsMiddleware::class]);
$router->get('/api/employees/{id}',    [EmployeeController::class, 'show'],    $auth);
$router->post('/api/employees',        [EmployeeController::class, 'store'],   $auth);
$router->put('/api/employees/{id}',    [EmployeeController::class, 'update'],  $auth);
$router->delete('/api/employees/{id}', [EmployeeController::class, 'destroy'], $auth);

// Availability (public)
$router->get('/api/availability',      [AvailabilityController::class, 'index'], [CorsMiddleware::class]);

// Health check
$router->get('/api/health', function ($req, $res) {
    $res->success(['status' => 'ok', 'timestamp' => date('c')]);
}, [CorsMiddleware::class]);
