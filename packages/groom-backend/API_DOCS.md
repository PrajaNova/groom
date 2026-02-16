# Groom Backend API Documentation

Base URL: `http://localhost:3002/api`

All endpoints are prefixed with `/api`. 
Responses are JSON.

## Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/auth/providers` | List enabled OAuth providers | No |
| `POST` | `/auth/register` | Register a new user (email/password) | No |
| `POST` | `/auth/login` | Login (email/password) | No |
| `POST` | `/auth/logout` | Logout current user | Yes |
| `GET` | `/auth/google/callback` | Google OAuth callback | No |
| `GET` | `/auth/facebook/callback` | Facebook OAuth callback | No |
| `GET` | `/auth/github/callback` | GitHub OAuth callback | No |
| `GET` | `/auth/discord/callback` | Discord OAuth callback | No |
| `GET` | `/auth/linkedin/callback` | LinkedIn OAuth callback | No |

**Note on OAuth:** 
Initiate OAuth by visiting `/api/auth/{provider}/start` (handled by `@fastify/oauth2`).

## User Management (`/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/user/profile` | Get current authenticated user profile | Yes |
| `PUT` | `/user/profile` | Update profile (bio, address, etc.) | Yes |
| `GET` | `/user/sessions` | List active sessions | Yes |
| `DELETE` | `/user/sessions` | Revoke all sessions (logout everywhere) | Yes |
| `DELETE` | `/user/sessions/:sessionId` | Revoke a specific session | Yes |

**Profile Fields:**
- `name`, `avatar`, `bio`, `phone`, `dateOfBirth`, `gender`
- `street`, `city`, `state`, `zipCode`, `country` (Address embedded)

## Bookings (`/bookings`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/bookings` | List bookings (Users: own, Admin: all) | No (Email lookup) / Yes |
| `POST` | `/bookings` | Create a new booking | No (Public) |
| `GET` | `/bookings/:id` | Get booking details | No (Public) |
| `PUT` | `/bookings/:id` | Update booking (status/time) | **Admin Only** |
| `DELETE` | `/bookings/:id` | Cancel/Delete booking | **Admin Only** |

## Blogs (`/blogs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs` | List all blogs | No |
| `GET` | `/blogs/:slug` | Get blog by slug | No |
| `POST` | `/blogs` | Create a new blog post | **Admin Only** |
| `PUT` | `/blogs/:slug` | Update a blog post | **Admin Only** |
| `DELETE` | `/blogs/:slug` | Delete a blog post | **Admin Only** |

## Confessions (`/confessions`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/confessions` | List recent confessions | No |
| `POST` | `/confessions` | Submit a confession | No (Anonymous) |
| `DELETE` | `/confessions/:id` | Delete a confession | **Admin Only** |

## Testimonials (`/testimonials`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/testimonials` | List all testimonials | No |
| `POST` | `/testimonials` | Create a testimonial | **Admin Only** |
| `PUT` | `/testimonials/:id` | Update a testimonial | **Admin Only** |
| `DELETE` | `/testimonials/:id` | Delete a testimonial | **Admin Only** |

## Roles & Permissions (`/roles`) - Admin Only

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/roles` | List all available roles | **Admin Only** |
| `POST` | `/roles` | Create a new role definition | **Admin Only** |
| `POST` | `/users/:id/roles` | Assign role to user | **Admin Only** |
| `DELETE` | `/users/:id/roles/:roleId` | Revoke role from user | **Admin Only** |

## JaaS (Video) (`/jaas`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/jaas/token` | Generate Jitsi JWT token | Yes |

## System

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service Info |
| `GET` | `/health` | Health Check (Status: ok) |
| `GET` | `/ready` | Readiness Check (DB connection) |
