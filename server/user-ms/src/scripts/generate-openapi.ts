import * as fs from "node:fs";
import * as path from "node:path";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import {
  AddressCreateSchema,
  AddressListResponseSchema,
  AddressResponseSchema,
  AddressUpdateSchema,
} from "@schemas/address.schema";
import {
  AuthResponseSchema,
  LoginRequestSchema,
  ProviderListResponseSchema,
  RegisterRequestSchema,
  UserProfileResponseSchema,
} from "@schemas/auth.schema";
// Import unified schemas
import { ErrorSchema, SuccessResponseSchema } from "@schemas/common";
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
import { UserResponseSchema, UserWithRolesSchema } from "@schemas/user.schema";
import * as yaml from "yaml";
import { z } from "zod";

const registry = new OpenAPIRegistry();

// Register component schemas
registry.register("User", UserResponseSchema);
registry.register("UserWithRoles", UserWithRolesSchema);
registry.register("Session", SessionResponseSchema);
registry.register("Role", RoleResponseSchema);
registry.register("Address", AddressResponseSchema);
registry.register("Error", ErrorSchema);
registry.register("SuccessResponse", SuccessResponseSchema);

// Auth endpoints
registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
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
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
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
          schema: SuccessResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/providers",
  tags: ["Auth"],
  summary: "Get list of OAuth providers",
  responses: {
    200: {
      description: "List of available OAuth providers",
      content: {
        "application/json": {
          schema: ProviderListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/callback/{provider}",
  tags: ["Auth"],
  summary: "OAuth callback endpoint",
  request: {
    params: z.object({
      provider: z.string(),
    }),
  },
  responses: {
    302: {
      description: "Redirect to application",
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

// User/Profile endpoints
registry.registerPath({
  method: "get",
  path: "/api/user/profile",
  tags: ["Auth"],
  summary: "Get user profile",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "User profile",
      content: {
        "application/json": {
          schema: UserProfileResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/user/sessions",
  tags: ["Auth"],
  summary: "Get user sessions",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of user sessions",
      content: {
        "application/json": {
          schema: SessionListResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/user/sessions/{sessionId}",
  tags: ["Auth"],
  summary: "Revoke a session",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      sessionId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Session revoked",
      content: {
        "application/json": {
          schema: SuccessResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

// Role endpoints
registry.registerPath({
  method: "post",
  path: "/api/roles",
  tags: ["Role"],
  summary: "Create a new role",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RoleCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Role created successfully",
      content: {
        "application/json": {
          schema: RoleResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    409: {
      description: "Role already exists",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/roles",
  tags: ["Role"],
  summary: "Get all roles",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of roles",
      content: {
        "application/json": {
          schema: RoleListResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/users/{id}/roles",
  tags: ["Role"],
  summary: "Assign role to user",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: AssignRoleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Role assigned successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

// Address endpoints
registry.registerPath({
  method: "post",
  path: "/api/addresses",
  tags: ["Address"],
  summary: "Create a new address",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddressCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Address created successfully",
      content: {
        "application/json": {
          schema: AddressResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/addresses",
  tags: ["Address"],
  summary: "Get all addresses",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of addresses",
      content: {
        "application/json": {
          schema: AddressListResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/addresses/{id}",
  tags: ["Address"],
  summary: "Get address by ID",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: "Address details",
      content: {
        "application/json": {
          schema: AddressResponseSchema,
        },
      },
    },
    404: {
      description: "Address not found",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/addresses/{id}",
  tags: ["Address"],
  summary: "Update address",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: AddressUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Address updated successfully",
      content: {
        "application/json": {
          schema: AddressResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "Address not found",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/addresses/{id}",
  tags: ["Address"],
  summary: "Delete address",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: "Address deleted successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema,
        },
      },
    },
    404: {
      description: "Address not found",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

// Generate OpenAPI document
const generator = new OpenApiGeneratorV31(registry.definitions);

const document = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "user-ms API",
    version: "1.0.0",
    description:
      "User Authentication and Profile Microservice with Multi-Provider OAuth Support",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.example.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication and authorization endpoints",
    },
    {
      name: "Role",
      description: "Role management endpoints",
    },
    {
      name: "Address",
      description: "Address management endpoints",
    },
  ],
});

// Add security schemes to components
if (!document.components) {
  document.components = {};
}

document.components.securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
  oauth2: {
    type: "oauth2",
    flows: {
      authorizationCode: {
        authorizationUrl: "https://api.example.com/api/auth/authorize",
        tokenUrl: "https://api.example.com/api/auth/token",
        scopes: {
          "read:user": "Read user information",
          "write:user": "Modify user information",
          "read:roles": "Read roles",
          "write:roles": "Manage roles",
          "read:addresses": "Read addresses",
          "write:addresses": "Manage addresses",
        },
      },
    },
  },
};

// Write to YAML file
const yamlContent = yaml.stringify(document);
const outputPath = path.join(__dirname, "../../docs/openapi.yaml");

fs.writeFileSync(outputPath, yamlContent, "utf-8");

console.log(`OpenAPI 3.1 specification generated at: ${outputPath}`);
