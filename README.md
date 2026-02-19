# Admin Panel API (Backend)

Backend desarrollado para la prueba técnica de un Admin Panel genérico
para ecommerce.

---

## Stack

- NestJS
- Prisma
- PostgreSQL
- JWT Authentication
- Swagger
- Docker (base de datos)

---

## Descripción

Esta API provee:

- Autenticación JWT
- CRUD completo de Categorías
- CRUD completo de Productos
- Gestión de Ventas con paginación real
- Documentación Swagger
- Manejo centralizado de errores
- DTOs de request y response
- Conversión explícita de Decimal → string
- Transacciones Prisma en creación de ventas

Arquitectura modular y enfocada en buenas prácticas.

---

## Requisitos

- Node.js 18+
- Docker Desktop
- npm

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Crear archivo .env

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h

CORS_ORIGIN=http://localhost:3000,http://localhost:3001

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/api?schema=public
```

---

## Base de Datos

### Levantar PostgreSQL

```bash
docker compose up -d
```

O si ya existe el contenedor:

```bash
docker start api_postgres
```

Verificar contenedores:

```bash
docker ps
```

---

## Prisma

### Crear migraciones en desarrollo

```bash
npm run prisma:dev
```

### Aplicar migraciones (producción / deploy)

```bash
npm run prisma:migrate
```

### Ejecutar seed

```bash
npm run prisma:seed
```

### Abrir Prisma Studio

```bash
npm run prisma:studio
```

El seed crea un usuario administrador para login.

---

## Ejecutar API

```bash
npm install
npm run start:dev
```

Servidor:

http://localhost:3000

Swagger:

http://localhost:3000/docs

---

## Autenticación

### Login

POST /auth/login

```json
{
  "email": "admin@local.com",
  "password": "admin1234"
}
```

Respuesta:

```json
{
  "access_token": "JWT_TOKEN"
}
```

### Uso en Swagger

1.  Ejecutar /auth/login
2.  Copiar access_token
3.  Click en "Authorize"
4.  Pegar:

Bearer JWT_TOKEN

---

## Endpoints

### Health

GET /health

---

### Categories (JWT requerido)

GET /categories\
GET /categories/:id\
POST /categories\
PATCH /categories/:id\
DELETE /categories/:id

---

### Products (JWT requerido)

GET /products\
GET /products/:id\
POST /products\
PATCH /products/:id\
DELETE /products/:id

- Se valida existencia de categoryId.
- price se maneja como Decimal en DB.
- Las respuestas usan DTOs explícitos.

---

### Sales (JWT requerido)

GET /sales?page=1&limit=10\
GET /sales/:id\
POST /sales

Características:

- Paginación real (page, limit, total, totalPages)
- Normalización de items duplicados
- Validación de productos inexistentes
- Transacciones Prisma
- Guardado de unitPrice histórico

---

## Scripts útiles

```bash
npm run start:dev        # Levanta la API en modo desarrollo
npm run prisma:dev       # Crea y aplica migraciones en desarrollo
npm run prisma:migrate   # Aplica migraciones en producción
npm run prisma:seed      # Ejecuta el seed
npm run prisma:studio    # Abre Prisma Studio
```

---

## Arquitectura

Módulos:

- auth
- categories
- products
- sales
- common

Incluye:

- ValidationPipe global
- PrismaExceptionFilter
- JwtAuthGuard
- DTO mapping explícito
- Swagger con BearerAuth

---

## Estado

Backend completo y listo para integración con frontend.
