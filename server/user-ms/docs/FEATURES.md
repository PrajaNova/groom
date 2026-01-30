# User Microservice Features

Comprehensive documentation of all features, endpoints, and capabilities of the user-ms service.

## Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Address Management](#address-management)
- [Session Management](#session-management)
- [Role Management](#role-management)
- [Audit Logging](#audit-logging)
- [Health Endpoints](#health-endpoints)

---

## Authentication

The user-ms supports both **OAuth 2.0** and **local authentication**.

### Local Authentication

Create accounts with email and password.

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as registration

#### Logout

```http
POST /api/auth/logout
Cookie: session=<session_token>
```

---

### OAuth 2.0 Providers

Supports 5 OAuth providers:

| Provider | Start URL | Callback URL |
|----------|-----------|--------------|
| **Google** | `/api/auth/google/start` | `/api/auth/google/callback` |
| **GitHub** | `/api/auth/github/start` | `/api/auth/github/callback` |
| **Facebook** | `/api/auth/facebook/start` | `/api/auth/facebook/callback` |
| **Discord** | `/api/auth/discord/start` | `/api/auth/discord/callback` |
| **LinkedIn** | `/api/auth/linkedin/start` | `/api/auth/linkedin/callback` |

#### List Available Providers

```http
GET /api/auth/providers
```

**Response:**
```json
{
  "providers": [
    { "name": "google", "displayName": "Google", "icon": "google" },
    { "name": "github", "displayName": "GitHub", "icon": "github" }
  ]
}
```

#### OAuth Flow

1. Redirect user to `/api/auth/{provider}/start`
2. User authenticates with provider
3. Provider redirects to callback
4. Service creates/updates user and session
5. Session cookie is set
6. User redirected to client application

---

## User Management

### Get Current User Profile

```http
GET /api/user/profile
Cookie: session=<session_token>
```

**Response:**
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "roles": [
    { "id": "clx...", "name": "USER" }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Profile

```http
PUT /api/user/profile
Cookie: session=<session_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.png"
}
```

---

## Address Management

Manage user shipping addresses.

### List Addresses

```http
GET /api/user/addresses
Cookie: session=<session_token>
```

**Response:**
```json
[
  {
    "id": "clx...",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890",
    "type": "Home",
    "isDefault": true
  }
]
```

### Create Address

```http
POST /api/user/addresses
Cookie: session=<session_token>
Content-Type: application/json

{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "type": "Home",
  "isDefault": true
}
```

### Update Address

```http
PUT /api/user/addresses/:id
Cookie: session=<session_token>
Content-Type: application/json

{
  "city": "Los Angeles",
  "state": "CA"
}
```

### Delete Address

```http
DELETE /api/user/addresses/:id
Cookie: session=<session_token>
```

---

## Session Management

Track and manage active sessions across devices.

### List Active Sessions

```http
GET /api/user/sessions
Cookie: session=<session_token>
```

**Response:**
```json
[
  {
    "id": "clx...",
    "sessionId": "sess_abc123",
    "device": "Chrome on Windows",
    "ipAddress": "192.168.1.1",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-02T00:00:00.000Z",
    "isCurrent": true
  },
  {
    "id": "clx...",
    "sessionId": "sess_xyz789",
    "device": "Safari on iPhone",
    "ipAddress": "192.168.1.2",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "expiresAt": "2024-01-02T12:00:00.000Z",
    "isCurrent": false
  }
]
```

### Revoke Specific Session

```http
DELETE /api/user/sessions/:sessionId
Cookie: session=<session_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Session revoked"
}
```

### Logout from All Sessions

```http
DELETE /api/user/sessions
Cookie: session=<session_token>
```

Revokes all sessions except the current one.

---

## Role Management

Dynamic role-based access control.

### List All Roles (Admin)

```http
GET /api/roles
Cookie: session=<admin_session>
```

**Response:**
```json
[
  { "id": "clx...", "name": "ADMIN", "description": "Full system access" },
  { "id": "clx...", "name": "SELLER", "description": "Product management" },
  { "id": "clx...", "name": "USER", "description": "Basic access" }
]
```

### Create Role (Admin)

```http
POST /api/roles
Cookie: session=<admin_session>
Content-Type: application/json

{
  "name": "MODERATOR",
  "description": "Content moderation access"
}
```

### Get User Roles

```http
GET /api/user/roles
Cookie: session=<session_token>
```

### Assign Role to User (Admin)

```http
POST /api/users/:userId/roles
Cookie: session=<admin_session>
Content-Type: application/json

{
  "roleId": "clx..."
}
```

### Revoke Role from User (Admin)

```http
DELETE /api/users/:userId/roles/:roleId
Cookie: session=<admin_session>
```

---

## Audit Logging

Automatic logging of security events.

### Tracked Events

| Event | Description |
|-------|-------------|
| `login` | User successfully logged in |
| `login_failed` | Failed login attempt |
| `logout` | User logged out |
| `register` | New user registered |
| `session_revoke` | Session was revoked |

### Log Entry Structure

```json
{
  "id": "clx...",
  "userId": "clx...",
  "event": "login",
  "metadata": {
    "provider": "google",
    "userAgent": "Mozilla/5.0..."
  },
  "ipAddress": "192.168.1.1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### View Audit Logs (Admin)

```http
GET /api/audit?limit=50&offset=0
Cookie: session=<admin_session>
```

---

## Health Endpoints

### Liveness Probe

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "service": "user-ms"
}
```

### Readiness Probe

```http
GET /api/ready
```

Checks database connectivity.

**Response (Success):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

**Response (Failure):**
```json
{
  "status": "not ready",
  "database": "disconnected"
}
```

### Service Info

```http
GET /api/
```

**Response:**
```json
{
  "service": "user-ms",
  "version": "1.0.0",
  "description": "User Authentication and Profile Microservice",
  "endpoints": {
    "auth": { ... },
    "user": { ... },
    "health": "/health"
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Email already registered"
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Not authenticated |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

---

## Rate Limiting

Default limits (configurable via environment):

| Endpoint | Limit |
|----------|-------|
| Authentication | 10 requests/minute |
| General API | 100 requests/minute |

**Response when exceeded:**
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design patterns
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup and guidelines
