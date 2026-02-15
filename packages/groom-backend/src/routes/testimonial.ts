import { TESTIMONIAL_ROUTES } from "@constants";
import { TestimonialController } from "@controllers/testimonial.controller";
import { authGuard } from "@middleware/auth";
import { roleGuard } from "@middleware/rbac";
import {
  TestimonialCreateSchema,
  TestimonialListResponseSchema,
  TestimonialResponseSchema,
  TestimonialUpdateSchema,
} from "@schemas/testimonial.schema";
import { ErrorSchema, IdParamSchema, SuccessResponseSchema } from "@schemas/common";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function testimonialRoutes(fastify: FastifyInstance) {
  const testimonialController = new TestimonialController(fastify);

  // GET /testimonials - List testimonials (public)
  fastify.get(
    TESTIMONIAL_ROUTES.LIST,
    {
      schema: createRouteSchema({
        response: { 200: TestimonialListResponseSchema },
      }),
    },
    async (request, reply) => testimonialController.list(request, reply),
  );

  // POST /testimonials - Create testimonial (ADMIN only)
  fastify.post(
    TESTIMONIAL_ROUTES.CREATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        body: TestimonialCreateSchema,
        response: { 201: TestimonialResponseSchema, 400: ErrorSchema },
      }),
    },
    async (request, reply) => testimonialController.create(request as any, reply),
  );

  // PUT /testimonials/:id - Update testimonial (ADMIN only)
  fastify.put<{ Params: { id: string } }>(
    TESTIMONIAL_ROUTES.UPDATE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        body: TestimonialUpdateSchema,
        response: { 200: TestimonialResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => testimonialController.update(request as any, reply),
  );

  // DELETE /testimonials/:id - Delete testimonial (ADMIN only)
  fastify.delete<{ Params: { id: string } }>(
    TESTIMONIAL_ROUTES.DELETE,
    {
      preHandler: [authGuard, roleGuard(["ADMIN"])],
      schema: createRouteSchema({
        params: IdParamSchema,
        response: { 200: SuccessResponseSchema, 404: ErrorSchema },
      }),
    },
    async (request, reply) => testimonialController.delete(request, reply),
  );
}
