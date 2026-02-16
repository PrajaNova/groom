import type { Testimonial } from "@generated/client";
import {
  type TestimonialCreate,
  TestimonialCreateSchema,
  type TestimonialUpdate,
  TestimonialUpdateSchema,
} from "@schemas/testimonial.schema";
import type { FastifyInstance } from "fastify";

export class TestimonialService {
  constructor(private fastify: FastifyInstance) {}

  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.fastify.prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    return this.fastify.prisma.testimonial.findUnique({
      where: { id },
    });
  }

  async createTestimonial(data: TestimonialCreate): Promise<Testimonial> {
    const validated = TestimonialCreateSchema.parse(data);

    return this.fastify.prisma.testimonial.create({
      data: {
        quote: validated.quote,
        author: validated.author,
      },
    });
  }

  async updateTestimonial(
    id: string,
    data: TestimonialUpdate,
  ): Promise<Testimonial | null> {
    const validated = TestimonialUpdateSchema.parse(data);

    const testimonial = await this.getTestimonialById(id);
    if (!testimonial) {
      return null;
    }

    return this.fastify.prisma.testimonial.update({
      where: { id },
      data: validated,
    });
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const testimonial = await this.getTestimonialById(id);
    if (!testimonial) {
      return false;
    }

    await this.fastify.prisma.testimonial.delete({
      where: { id },
    });

    return true;
  }
}
