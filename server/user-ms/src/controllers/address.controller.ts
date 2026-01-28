import { ERROR_MESSAGES } from "@constants";
import { AddressCreateSchema } from "@schemas/address.schema";
import { AddressService } from "@services/address.service";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class AddressController {
  constructor(private fastify: FastifyInstance) {}

  // POST /addresses
  async createAddress(
    request: FastifyRequest<{
      Body: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
        type?: string;
        isDefault?: boolean;
      };
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const addressService = new AddressService(this.fastify);
    const validatedBody = AddressCreateSchema.parse(request.body);
    const address = await addressService.createAddress(
      request.user.id,
      validatedBody,
    );

    return reply.code(201).send(address);
  }

  // GET /addresses
  async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const addressService = new AddressService(this.fastify);
    const addresses = await addressService.getUserAddresses(request.user.id);

    return addresses;
  }

  // GET /addresses/:id
  async getAddress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const addressService = new AddressService(this.fastify);
    const address = await addressService.getAddressById(request.params.id);

    if (!address || address.userId !== request.user.id) {
      return reply.notFound("Address not found");
    }

    return address;
  }

  // PUT /addresses/:id
  async updateAddress(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<{
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
        type: string;
        isDefault: boolean;
      }>;
    }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const addressService = new AddressService(this.fastify);
    const updatedAddress = await addressService.updateAddress(
      request.params.id,
      request.user.id,
      request.body,
    );

    if (!updatedAddress) {
      return reply.notFound("Address not found");
    }

    return updatedAddress;
  }

  // DELETE /addresses/:id
  async deleteAddress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const addressService = new AddressService(this.fastify);
    const success = await addressService.deleteAddress(
      request.params.id,
      request.user.id,
    );

    if (!success) {
      return reply.notFound("Address not found");
    }

    return { success: true };
  }
}
