<?php

declare(strict_types=1);

define('BASE_PATH', dirname(__DIR__));

require_once BASE_PATH . '/vendor/autoload.php';

use Core\Router\Router;
use Core\Http\Request;
use Core\Http\Response;

// Bootstrap the application
$app = require_once BASE_PATH . '/bootstrap/app.php';

// Handle the request
$request  = new Request();
$response = new Response();
$router   = new Router($request, $response);

// Load routes
require_once BASE_PATH . '/routes/api.php';

$router->dispatch();
