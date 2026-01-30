import { USER_ROUTES } from "@constants";
import { AddressController } from "@controllers/address.controller";
import { authGuard } from "@middleware/auth";
import {
  type AddressCreate,
  AddressCreateSchema,
  AddressListResponseSchema,
  AddressResponseSchema,
  AddressUpdateSchema,
} from "@schemas/address.schema";
import { ErrorSchema, IdParamSchema } from "@schemas/common";
import { createRouteSchema } from "@utils/schema";
import type { FastifyInstance } from "fastify";

export default async function addressRoutes(fastify: FastifyInstance) {
  const addressController = new AddressController(fastify);

  // POST /user/addresses - Create address
  fastify.post<{ Body: AddressCreate }>(
    USER_ROUTES.ADDRESSES,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        body: AddressCreateSchema,
        response: {
          201: AddressResponseSchema,
          400: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return addressController.createAddress(request, reply);
    },
  );

  // GET /user/addresses - List addresses
  fastify.get(
    USER_ROUTES.ADDRESSES,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        response: {
          200: AddressListResponseSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return addressController.getAddresses(request, reply);
    },
  );

  // GET /user/addresses/:id - Get address by ID
  fastify.get<{ Params: { id: string } }>(
    USER_ROUTES.ADDRESS_BY_ID,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        params: IdParamSchema,
        response: {
          200: AddressResponseSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return addressController.getAddress(request, reply);
    },
  );

  // PUT /user/addresses/:id - Update address
  fastify.put(
    USER_ROUTES.ADDRESS_BY_ID,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        params: IdParamSchema,
        body: AddressUpdateSchema,
        response: {
          200: AddressResponseSchema,
          400: ErrorSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return addressController.updateAddress(request as any, reply);
    },
  );

  // DELETE /user/addresses/:id - Delete address
  fastify.delete<{ Params: { id: string } }>(
    USER_ROUTES.ADDRESS_BY_ID,
    {
      preHandler: authGuard,
      schema: createRouteSchema({
        params: IdParamSchema,
        response: {
          200: AddressResponseSchema,
          404: ErrorSchema,
          500: ErrorSchema,
        },
      }),
    },
    async (request, reply) => {
      return addressController.deleteAddress(request, reply);
    },
  );
}
