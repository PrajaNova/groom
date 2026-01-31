# 🔐 User Microservice (user-ms)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.x-black.svg)](https://fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748.svg)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

> A production-ready authentication and user management microservice for the e-cart platform.

## Overview

**user-ms** handles all user-related functionality for the e-cart microservices ecosystem. Built with Fastify for high performance and TypeScript for type safety, it provides secure authentication, profile management, and role-based access control.

### Key Highlights

- 🚀 **High Performance** - Fastify framework with async/await patterns
- 🔒 **Multi-Auth** - OAuth 2.0 (Google, GitHub, Facebook, Discord, LinkedIn) + Local
- 🎯 **Type-Safe** - Full TypeScript with strict mode
- 📊 **Audit Ready** - Comprehensive security event logging
- 🔧 **Modular** - Plugin-based architecture for easy extension

---

## Quick Links

| Resource | Description |
|----------|-------------|
| 📖 [Architecture](./docs/ARCHITECTURE.md) | System design, patterns, and data models |
| 💻 [Development](./docs/DEVELOPMENT.md) | Setup, workflow, and contribution guide |
| ✨ [Features](./docs/FEATURES.md) | API reference and endpoint documentation |

---

## Core Features

### Authentication
- **Local Auth** - Email/password with bcrypt hashing
- **OAuth 2.0** - Google, GitHub, Facebook, Discord, LinkedIn
- **Session Management** - JWT-based with device tracking
- **Multi-Session** - Use from multiple devices simultaneously

### User Management
- Profile CRUD operations
- Avatar support
- Multiple shipping addresses
- Role-based permissions

### Security
- Rate limiting
- CORS protection
- Security headers (Helmet)
- HttpOnly secure cookies
- Password strength validation
- Failed login tracking

---

## Tech Stack

```
├── Runtime     → Node.js 18+
├── Framework   → Fastify 4.x
├── Language    → TypeScript 5.x
├── Database    → PostgreSQL (Neon)
├── ORM         → Prisma 5.x
├── Auth        → JWT + OAuth 2.0
└── Validation  → Zod
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

🌐 Service runs at `http://localhost:3002`

---

## API Endpoints

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Service information |
| GET | `/api/health` | Liveness probe |
| GET | `/api/ready` | Readiness probe |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/logout` | Logout current session |
| GET | `/api/auth/providers` | List OAuth providers |
| GET | `/api/auth/{provider}/start` | Start OAuth flow |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/sessions` | List active sessions |
| DELETE | `/api/user/sessions/:id` | Revoke session |

### Addresses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/addresses` | List addresses |
| POST | `/api/user/addresses` | Create address |
| PUT | `/api/user/addresses/:id` | Update address |
| DELETE | `/api/user/addresses/:id` | Delete address |

📚 Full API documentation: [docs/FEATURES.md](./docs/FEATURES.md)

---

## Project Structure

```
user-ms/
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System design
│   ├── DEVELOPMENT.md    # Dev guide
│   └── FEATURES.md       # API reference
├── prisma/
│   └── schema.prisma     # Database schema
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # HTTP endpoints
│   ├── plugins/          # Fastify plugins
│   │   └── oauth/        # OAuth providers
│   ├── middleware/       # Auth middleware
│   ├── schemas/          # Zod validation
│   └── constants.ts      # Centralized constants
├── .env.example          # Environment template
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run production server |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open database GUI |
| `pnpm test` | Run tests |

---

## Environment Variables

Key variables (see `.env.example` for full list):

```env
# Server
PORT=3002
NODE_ENV=development

# Database
DATABASE_URL="postgresql://..."

# Security
JWT_SECRET="your-secret-min-32-chars"
COOKIE_SECRET="your-secret-min-32-chars"

# OAuth (optional)
GOOGLE_ENABLED=true
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## Data Models

| Model | Purpose |
|-------|---------|
| **User** | Core user identity |
| **Role** | RBAC permissions |
| **Address** | Shipping addresses |
| **Session** | Active sessions |
| **ProviderAccount** | OAuth links |
| **Token** | OAuth tokens |
| **AuditLog** | Security events |

---

## Documentation

- 📖 **[Architecture](./docs/ARCHITECTURE.md)** - Detailed system design, patterns, data flow
- 💻 **[Development](./docs/DEVELOPMENT.md)** - Setup instructions, workflow, debugging
- ✨ **[Features](./docs/FEATURES.md)** - Complete API reference with examples

---

## Contributing

1. Read [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
2. Create feature branch from `main`
3. Follow TypeScript strict mode
4. Use conventional commits
5. Submit PR with tests

---

## License

ISC License - see [LICENSE](../LICENSE) for details.

---

<p align="center">
  Part of the <strong>e-cart</strong> microservices ecosystem
</p>
