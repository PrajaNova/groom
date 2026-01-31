# User Microservice Development Guide

This guide covers everything you need to set up, develop, and contribute to the user-ms service.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Service](#running-the-service)
- [Development Workflow](#development-workflow)
- [Code Organization](#code-organization)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 18.x+ | JavaScript runtime |
| **pnpm** | 8.x+ | Package manager |
| **PostgreSQL** | 14+ | Database (or use Neon) |
| **Git** | 2.x+ | Version control |

### Optional Tools

- **Prisma Studio** - Database GUI (included with Prisma)
- **Postman/Insomnia** - API testing
- **VS Code** - Recommended IDE with TypeScript support

---

## Quick Start

```bash
# 1. Navigate to service directory
cd services/user-ms

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.example .env

# 4. Configure your .env file (see Environment Setup)

# 5. Generate Prisma client
pnpm db:generate

# 6. Push database schema
pnpm db:push

# 7. Start development server
pnpm dev
```

The service will start at `http://localhost:3002`.

---

## Environment Setup

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3002
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Security (REQUIRED - generate secure random strings)
COOKIE_SECRET="min-32-character-secret-for-cookies"
JWT_SECRET="min-32-character-secret-for-jwt-tokens"
SESSION_EXPIRY_HOURS=24

# CORS (comma-separated allowed origins)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### OAuth Provider Setup (Optional)

To enable OAuth providers, configure their credentials:

```env
# Google OAuth
GOOGLE_ENABLED=true
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3002/api/auth/google/callback"

# GitHub OAuth
GITHUB_ENABLED=true
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3002/api/auth/github/callback"

# Facebook, Discord, LinkedIn follow the same pattern
```

### Getting OAuth Credentials

| Provider | Console URL |
|----------|-------------|
| Google | [console.cloud.google.com](https://console.cloud.google.com/) |
| GitHub | [github.com/settings/apps](https://github.com/settings/apps) |
| Facebook | [developers.facebook.com](https://developers.facebook.com/) |
| Discord | [discord.com/developers](https://discord.com/developers/) |
| LinkedIn | [linkedin.com/developers](https://www.linkedin.com/developers/) |

---

## Database Setup

### Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to `DATABASE_URL`
4. Copy the direct connection string to `DIRECT_URL`

### Using Local PostgreSQL

```bash
# Create database
createdb user_ms_dev

# Update .env
DATABASE_URL="postgresql://localhost:5432/user_ms_dev"
```

### Prisma Commands

```bash
# Generate Prisma client (after schema changes)
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Create a migration (production)
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio
```

---

## Running the Service

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run production server |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests with Vitest |

### Development Mode

```bash
pnpm dev
```

Features:
- ✅ Hot reload on file changes
- ✅ Pretty-printed logs
- ✅ Source maps for debugging

### Production Mode

```bash
pnpm build
pnpm start
```

---

## Development Workflow

### Code Style

This project uses:
- **TypeScript** with strict mode
- **Biome** for linting and formatting
- **Centralized constants** (no hardcoded strings)

### Commit Guidelines

Follow conventional commits:

```
feat: add user avatar upload
fix: session expiry not working correctly
docs: update API documentation
refactor: extract validation to schema
```

### Branch Naming

```
feat/user-avatar
fix/session-expiry-bug
docs/api-reference
refactor/validation-layer
```

---

## Code Organization

### Adding a New Endpoint

1. **Create/Update Schema** (`src/schemas/`)
```typescript
// src/schemas/example.schema.ts
import { z } from "zod";

export const ExampleCreateSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
});

export type ExampleCreate = z.infer<typeof ExampleCreateSchema>;
```

2. **Create Service** (`src/services/`)
```typescript
// src/services/example.service.ts
import type { FastifyInstance } from "fastify";

export class ExampleService {
  constructor(private fastify: FastifyInstance) {}

  async create(data: ExampleCreate) {
    return this.fastify.prisma.example.create({ data });
  }
}
```

3. **Create Controller** (`src/controllers/`)
```typescript
// src/controllers/example.controller.ts
import { ExampleService } from "@services/example.service";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export class ExampleController {
  constructor(private fastify: FastifyInstance) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const service = new ExampleService(this.fastify);
    const result = await service.create(request.body);
    return reply.code(201).send(result);
  }
}
```

4. **Create Route** (`src/routes/`)
```typescript
// src/routes/example.ts
import type { FastifyInstance } from "fastify";
import { ExampleController } from "@controllers/example.controller";
import { ExampleCreateSchema } from "@schemas/example.schema";

export default async function (fastify: FastifyInstance) {
  const controller = new ExampleController(fastify);

  fastify.post("/examples", {
    schema: { body: ExampleCreateSchema },
    handler: controller.create.bind(controller),
  });
}
```

### Adding a New OAuth Provider

1. Create plugin at `src/plugins/oauth/provider.ts`
2. Add constants to `src/constants.ts`
3. Add controller method in `AuthController`
4. Update `.env.example` with new variables

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run with coverage
pnpm test --coverage
```

### Manual API Testing

```bash
# Health check
curl http://localhost:3002/api/health

# List OAuth providers
curl http://localhost:3002/api/auth/providers

# Register user (local auth)
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}' \
  -c cookies.txt

# Access protected route
curl http://localhost:3002/api/user/profile \
  -b cookies.txt
```

---

## Debugging

### VS Code Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug user-ms",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev:debug"],
      "cwd": "${workspaceFolder}/services/user-ms",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Logging

```typescript
// Use structured logging
fastify.log.info({ userId, action: "login" }, "User logged in");
fastify.log.error({ err: error }, "Database connection failed");
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module '@prisma/client'` | Run `pnpm db:generate` |
| Database connection error | Check `DATABASE_URL` in `.env` |
| CORS errors in browser | Add origin to `ALLOWED_ORIGINS` |
| OAuth callback fails | Verify callback URL matches provider config |
| JWT verification fails | Check `JWT_SECRET` is consistent |
| Port already in use | Change `PORT` in `.env` or kill existing process |

### Reset Development Environment

```bash
# Clean build artifacts
rm -rf dist node_modules/.prisma

# Reinstall and regenerate
pnpm install
pnpm db:generate
pnpm dev
```

### Database Reset

```bash
# Push schema (drops and recreates tables)
pnpm db:push --force-reset

# Or use migration (preserves data)
pnpm db:migrate
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design patterns
- [FEATURES.md](./FEATURES.md) - Feature documentation and API reference
