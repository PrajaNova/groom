/**
 * Schema Utilities
 * Helper functions for converting Zod schemas to JSON Schema for Fastify
 */

import type { ZodSchema } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Convert a Zod schema to JSON Schema for Fastify validation
 * @param schema - Zod schema to convert
 * @param name - Optional name for the schema
 * @returns JSON Schema object
 */
export function toJsonSchema(schema: ZodSchema, name?: string) {
  // Cast to any for Zod v4 compatibility with zod-to-json-schema
  return zodToJsonSchema(schema as any, name);
}

/**
 * Create a Fastify route schema with Zod schemas
 * Automatically converts all Zod schemas to JSON Schema
 */
export function createRouteSchema(config: {
  body?: ZodSchema;
  params?: ZodSchema;
  querystring?: ZodSchema;
  headers?: ZodSchema;
  response?: Record<number, ZodSchema>;
}) {
  const schema: any = {};

  if (config.body) {
    schema.body = toJsonSchema(config.body);
  }

  if (config.params) {
    schema.params = toJsonSchema(config.params);
  }

  if (config.querystring) {
    schema.querystring = toJsonSchema(config.querystring);
  }

  if (config.headers) {
    schema.headers = toJsonSchema(config.headers);
  }

  if (config.response) {
    schema.response = {};
    for (const [statusCode, responseSchema] of Object.entries(
      config.response,
    )) {
      schema.response[statusCode] = toJsonSchema(responseSchema);
    }
  }

  return schema;
}
