import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
	insertUserSchema,
	selectUserSchema,
	users as usersTable,
} from "@/schema/users";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	const app = fastify.withTypeProvider<ZodTypeProvider>();

	app.post(
		"/",
		{
			schema: {
				body: insertUserSchema,
				response: {
					201: selectUserSchema,
				},
			},
		},
		async (request, reply) => {
			const newUser = await fastify.db
				.insert(usersTable)
				.values(request.body)
				.returning();
			reply.code(201).send(newUser[0]);
		},
	);

	app.get(
		"/",
		{
			schema: {
				response: {
					200: z.array(selectUserSchema),
				},
			},
		},
		async (request, reply) => {
			const users = await fastify.db.select().from(usersTable);
			return users;
		},
	);
};

export default users;
