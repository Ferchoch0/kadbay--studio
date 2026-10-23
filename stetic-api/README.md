# stetic-api

REST API para **Estudio de Belleza Stetic**. Construida en PHP puro con arquitectura MVC + Clean Architecture.

## Stack

- PHP >= 8.1 (via XAMPP)
- MySQL (via XAMPP) — interfaz: **phpMyAdmin** en `http://localhost/phpmyadmin`
- **MySQLi** nativo (extensión incluida en XAMPP, sin instalación extra)
- JWT (`firebase/php-jwt`)
- Dotenv (`vlucas/phpdotenv`)

## Estructura

```
stetic-api/
├── public/             # Entry point (index.php + .htaccess)
├── bootstrap/          # Inicialización de la app
├── routes/             # Definición de rutas (api.php)
├── app/
│   ├── Controllers/    # Reciben request, devuelven response
│   ├── Services/       # Lógica de negocio
│   ├── Repositories/   # Acceso a datos (Interface + MySQL)
│   ├── Middleware/     # Auth, CORS
│   ├── Validators/     # Validación de inputs
│   ├── DTOs/           # Data Transfer Objects
│   ├── Models/         # Modelos de datos (value objects)
│   ├── Helpers/        # Funciones utilitarias
│   └── Exceptions/     # Handler global de errores
├── core/
│   ├── Router/         # Router HTTP propio
│   ├── Http/           # Request & Response wrappers
│   ├── Database/       # Conexión PDO (Singleton)
│   └── Auth/           # JWT Handler
├── database/
│   ├── migrations/     # Creación de tablas
│   └── seeders/        # Datos de prueba
├── tests/
│   ├── Unit/           # Pruebas unitarias
│   └── Feature/        # Pruebas de integración
├── storage/
│   ├── logs/
│   ├── cache/
│   └── uploads/
├── config/             # Configuraciones adicionales
└── scripts/            # Scripts CLI
```

## Instalación

```bash
# 1. Instalar dependencias
composer install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Correr servidor de desarrollo
composer run serve
# → http://localhost:8000
```

## Endpoints

| Método | Ruta                    | Auth | Descripción          |
|--------|-------------------------|------|----------------------|
| POST   | /api/auth/login         | ❌   | Login                |
| POST   | /api/auth/register      | ❌   | Registro             |
| GET    | /api/auth/me            | ✅   | Usuario actual       |
| GET    | /api/clients            | ✅   | Listar clientes      |
| POST   | /api/clients            | ✅   | Crear cliente        |
| GET    | /api/clients/{id}       | ✅   | Ver cliente          |
| PUT    | /api/clients/{id}       | ✅   | Actualizar cliente   |
| DELETE | /api/clients/{id}       | ✅   | Eliminar cliente     |
| GET    | /api/appointments       | ✅   | Listar turnos        |
| POST   | /api/appointments       | ✅   | Crear turno          |
| GET    | /api/appointments/{id}  | ✅   | Ver turno            |
| PUT    | /api/appointments/{id}  | ✅   | Actualizar turno     |
| DELETE | /api/appointments/{id}  | ✅   | Cancelar turno       |
| GET    | /api/services           | ✅   | Listar servicios     |
| GET    | /api/employees          | ✅   | Listar empleados     |
| GET    | /api/health             | ❌   | Health check         |

## Tests

```bash
composer run test
```
