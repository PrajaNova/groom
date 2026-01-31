import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import {
  AuthResponseSchema,
  LoginRequestSchema,
  ProviderListResponseSchema,
  ProviderSchema,
  RegisterRequestSchema,
  UserProfileResponseSchema,
} from "@schemas/auth.schema";
import {
  BlogListResponseSchema,
  BlogResponseSchema,
  CreateBlogRequestSchema,
  UpdateBlogRequestSchema,
} from "@schemas/blog.schema";
import {
  BookingListResponseSchema,
  BookingQuerySchema,
  BookingResponseSchema,
  CreateBookingRequestSchema,
} from "@schemas/booking.schema";
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
import {
  ConfessionListResponseSchema,
  ConfessionResponseSchema,
  CreateConfessionRequestSchema,
} from "@schemas/confession.schema";
import {
  JaasTokenRequestSchema,
  JaasTokenResponseSchema,
} from "@schemas/jaas.schema";
import {
  AssignRoleSchema,
  RoleCreateSchema,
  RoleListResponseSchema,
  RoleResponseSchema,
} from "@schemas/role.schema";
import {
  SessionListResponseSchema,
  SessionResponseSchema,
} from "@schemas/session.schema";
import { UserResponseSchema } from "@schemas/user.schema";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { z } from "zod";

const registry = new OpenAPIRegistry();

// --- Register Component Schemas ---

// Common
registry.register("Error", ErrorSchema);
registry.register("SuccessResponse", SuccessResponseSchema);

// User & Auth
registry.register("User", UserResponseSchema);
// UserWithRoles removed as it is not exported by schema
// registry.register("UserWithRoles", UserWithRolesSchema);
registry.register("Session", SessionResponseSchema);
registry.register("AuthResponse", AuthResponseSchema);
registry.register("UserProfileResponse", UserProfileResponseSchema);
registry.register("RegisterRequest", RegisterRequestSchema);
registry.register("LoginRequest", LoginRequestSchema);
registry.register("Provider", ProviderSchema);
registry.register("ProviderListResponse", ProviderListResponseSchema);

// Roles
registry.register("Role", RoleResponseSchema);
registry.register("RoleCreate", RoleCreateSchema);
registry.register("RoleListResponse", RoleListResponseSchema);
registry.register("AssignRole", AssignRoleSchema);

// Blogs
registry.register("Blog", BlogResponseSchema);
registry.register("CreateBlogRequest", CreateBlogRequestSchema);
registry.register("UpdateBlogRequest", UpdateBlogRequestSchema);
registry.register("BlogListResponse", BlogListResponseSchema);

// Bookings
registry.register("Booking", BookingResponseSchema);
registry.register("CreateBookingRequest", CreateBookingRequestSchema);
registry.register("BookingListResponse", BookingListResponseSchema);
registry.register("BookingQuery", BookingQuerySchema);

// Confessions
registry.register("Confession", ConfessionResponseSchema);
registry.register("CreateConfessionRequest", CreateConfessionRequestSchema);
registry.register("ConfessionListResponse", ConfessionListResponseSchema);

// JaaS
registry.register("JaasTokenRequest", JaasTokenRequestSchema);
registry.register("JaasTokenResponse", JaasTokenResponseSchema);

// --- Register Paths ---

// Auth Routes
registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": { schema: RegisterRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  tags: ["Auth"],
  summary: "Login user",
  request: {
    body: {
      content: {
        "application/json": { schema: LoginRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/logout",
  tags: ["Auth"],
  summary: "Logout user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Logout successful",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean(), message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/me",
  tags: ["Auth"],
  summary: "Get current user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Current user profile",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/providers",
  tags: ["Auth"],
  summary: "Get OAuth providers",
  responses: {
    200: {
      description: "List of providers",
      content: { "application/json": { schema: ProviderListResponseSchema } },
    },
  },
});

// Blog Routes
registry.registerPath({
  method: "get",
  path: "/api/blogs",
  tags: ["Blogs"],
  summary: "Get all blogs",
  responses: {
    200: {
      description: "List of blogs",
      content: { "application/json": { schema: BlogListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/blogs",
  tags: ["Blogs"],
  summary: "Create a blog post",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreateBlogRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "Blog created",
      content: { "application/json": { schema: BlogResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/blogs/{slug}",
  tags: ["Blogs"],
  summary: "Get blog by slug",
  request: {
    params: z.object({ slug: z.string() }),
  },
  responses: {
    200: {
      description: "Blog details",
      content: { "application/json": { schema: BlogResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// Booking Routes
registry.registerPath({
  method: "get",
  path: "/api/bookings",
  tags: ["Bookings"],
  summary: "Get bookings",
  security: [{ bearerAuth: [] }],
  request: {
    query: BookingQuerySchema,
  },
  responses: {
    200: {
      description: "List of bookings",
      content: { "application/json": { schema: BookingListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/bookings",
  tags: ["Bookings"],
  summary: "Create booking",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreateBookingRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "Booking created",
      content: { "application/json": { schema: BookingResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/bookings/{id}",
  tags: ["Bookings"],
  summary: "Get booking by ID",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Booking details",
      content: { "application/json": { schema: BookingResponseSchema } },
    },
  },
});

// Confession Routes
registry.registerPath({
  method: "get",
  path: "/api/confessions",
  tags: ["Confessions"],
  summary: "Get recent confessions",
  responses: {
    200: {
      description: "List of confessions",
      content: { "application/json": { schema: ConfessionListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/confessions",
  tags: ["Confessions"],
  summary: "Create confession",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateConfessionRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Confession created",
      content: { "application/json": { schema: ConfessionResponseSchema } },
    },
  },
});

// JaaS Routes
registry.registerPath({
  method: "post",
  path: "/api/jaas",
  tags: ["JaaS"],
  summary: "Generate Jitsi token",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: JaasTokenRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Token generated",
      content: { "application/json": { schema: JaasTokenResponseSchema } },
    },
  },
});

// Role Routes
registry.registerPath({
  method: "get",
  path: "/api/roles",
  tags: ["Roles"],
  summary: "Get all roles",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of roles",
      content: { "application/json": { schema: RoleListResponseSchema } },
    },
  },
});

// Generate Document
const generator = new OpenApiGeneratorV31(registry.definitions);

const document = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Groom MS API",
    version: "1.0.0",
    description: "API for Grooming and Booking Microservice",
  },
  servers: [{ url: "http://localhost:3000", description: "Development" }],
});

// Add Security Schemes
document.components!.securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};

// Write to file
const outputPath = path.join(__dirname, "../docs/openapi.yaml");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, yaml.stringify(document), "utf-8");
console.log(`OpenAPI 3.1 specification generated at: ${outputPath}`);
