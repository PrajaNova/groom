import "dotenv/config";
import Fastify from "fastify";
import app, { options } from "./app";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";
const server = Fastify(options);

// Register the app plugin
server.register(app);

// Start the server
const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });

    // Log server startup information
    server.log.info("=".repeat(60));
    server.log.info(`🚀 Server is running!`);
    server.log.info(`📍 Host: ${HOST}`);
    server.log.info(`🔌 Port: ${PORT}`);
    server.log.info(
      `🌍 URL: http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`,
    );
    server.log.info(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    server.log.info("=".repeat(60));
  } catch (err) {
    server.log.error("❌ Error starting server:");
    server.log.error(err);
    process.exit(1);
  }
};

start();
