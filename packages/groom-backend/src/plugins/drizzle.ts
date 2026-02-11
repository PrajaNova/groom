import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import fp from "fastify-plugin";
import { Pool } from "pg";
import * as schema from "@/schema";

export type DbClient = NodePgDatabase<typeof schema>;

export default fp(async (fastify) => {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	const db = drizzle(pool, { schema });

	fastify.decorate("db", db);

	fastify.addHook("onClose", async () => {
		await pool.end();
	});
});

declare module "fastify" {
	interface FastifyInstance {
		db: DbClient;
	}
}
