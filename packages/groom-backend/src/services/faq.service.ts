import type { FAQ } from "@generated/client";
import {
  type FAQCreate,
  FAQCreateSchema,
  type FAQUpdate,
  FAQUpdateSchema,
} from "@schemas/faq.schema";
import type { FastifyInstance } from "fastify";

export class FAQService {
  constructor(private fastify: FastifyInstance) {}

  async getAllFAQs(): Promise<FAQ[]> {
    return this.fastify.prisma.fAQ.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    return this.fastify.prisma.fAQ.findUnique({
      where: { id },
    });
  }

  async createFAQ(data: FAQCreate): Promise<FAQ> {
    const validated = FAQCreateSchema.parse(data);

    return this.fastify.prisma.fAQ.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        order: validated.order,
      },
    });
  }

  async updateFAQ(id: string, data: FAQUpdate): Promise<FAQ | null> {
    const validated = FAQUpdateSchema.parse(data);

    const faq = await this.getFAQById(id);
    if (!faq) {
      return null;
    }

    return this.fastify.prisma.fAQ.update({
      where: { id },
      data: validated,
    });
  }

  async deleteFAQ(id: string): Promise<boolean> {
    const faq = await this.getFAQById(id);
    if (!faq) {
      return false;
    }

    await this.fastify.prisma.fAQ.delete({
      where: { id },
    });

    return true;
  }
}
