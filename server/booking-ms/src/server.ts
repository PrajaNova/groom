import Fastify from "fastify";
import app, { options } from "./app";
import { env } from "./config/env";

const server = Fastify(options);

server.register(app);

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: "0.0.0.0" });
    
    server.log.info("=".repeat(60));
    server.log.info(`🚀 Server (booking-ms) is running!`);
    server.log.info(`🔌 Port: ${env.PORT}`);
    server.log.info(`🔧 Environment: ${env.NODE_ENV}`);
    server.log.info("=".repeat(60));

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
