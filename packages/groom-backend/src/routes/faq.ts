import { FAQ_ROUTES } from "@constants";
import { FAQController } from "@controllers/faq.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import { ErrorSchema, IdParamSchema, SuccessResponseSchema } from "@schemas/common";
import {
  FAQCreateSchema,
  FAQListResponseSchema,
  FAQResponseSchema,
  FAQUpdateSchema,
} from "@schemas/faq.schema";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function faqRoutes(fastify: FastifyInstance) {
  const faqController = new FAQController(fastify);

  // GET /faqs - List all FAQs (public)
  fastify.get(
    FAQ_ROUTES.LIST,
    {
      schema: createRouteSchema({
        response: { 200: FAQListResponseSchema },
      }),
    },
    async (request, reply) => faqController.list(request, reply),
  );

  // POST /faqs - Create FAQ (ADMIN only)
  fastify.post(
    FAQ_ROUTES.CREATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        body: FAQCreateSchema,
        response: {
          201: FAQResponseSchema,
          400: ErrorSchema,
        },
      }),
    },
    async (request, reply) => faqController.create(request as any, reply),
  );

  // PUT /faqs/:id - Update FAQ (ADMIN only)
  fastify.put<{ Params: { id: string } }>(
    FAQ_ROUTES.BY_ID,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: FAQUpdateSchema,
        response: { 200: FAQResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => faqController.update(request as any, reply),
  );

  // DELETE /faqs/:id - Delete FAQ (ADMIN only)
  fastify.delete<{ Params: { id: string } }>(
    FAQ_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN", "SUPER_ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: SuccessResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => faqController.delete(request, reply),
  );
}
