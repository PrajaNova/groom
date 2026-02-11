import swagger, { type FastifySwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export default fp<FastifySwaggerOptions>(async (fastify) => {
	fastify.register(swagger, {
		openapi: {
			info: {
				title: "Groom Backend API",
				description: "Sample backend service",
				version: "1.0.0",
			},
			servers: [],
		},
		transform: jsonSchemaTransform,
	});

	fastify.register(swaggerUi, {
		routePrefix: "/documentation",
	});
});
