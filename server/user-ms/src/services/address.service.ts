import type { Address } from "@prisma/client";
import {
  type AddressCreate,
  AddressCreateSchema,
  type AddressUpdate,
  AddressUpdateSchema,
} from "@schemas/address.schema";
import type { FastifyInstance } from "fastify";

export class AddressService {
  constructor(private fastify: FastifyInstance) {}

  async createAddress(userId: string, data: AddressCreate): Promise<Address> {
    // Validate input with Zod schema
    const validated = AddressCreateSchema.parse(data);

    // If setting as default, unset other default addresses for this user
    if (validated.isDefault) {
      await this.fastify.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.fastify.prisma.address.create({
      data: {
        ...validated,
        userId,
      },
    });
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.fastify.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAddressById(id: string): Promise<Address | null> {
    return this.fastify.prisma.address.findUnique({
      where: { id },
    });
  }

  async updateAddress(
    id: string,
    userId: string,
    data: AddressUpdate,
  ): Promise<Address | null> {
    // Validate input with Zod schema
    const validated = AddressUpdateSchema.parse(data);

    // Check if address exists and belongs to user
    const address = await this.getAddressById(id);
    if (!address || address.userId !== userId) {
      return null;
    }

    // If setting as default, unset other default addresses
    if (validated.isDefault) {
      await this.fastify.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.fastify.prisma.address.update({
      where: { id },
      data: validated,
    });
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    const address = await this.getAddressById(id);
    if (!address || address.userId !== userId) {
      return false;
    }

    await this.fastify.prisma.address.delete({
      where: { id },
    });

    return true;
  }
}
