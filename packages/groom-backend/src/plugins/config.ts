import { loadConfig } from "@config";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * This plugin loads and decorates the app configuration
 */
export default fp(
  async (fastify: FastifyInstance) => {
    const config = loadConfig();

    fastify.decorate("config", config);

    fastify.log.info("Configuration loaded successfully");
    fastify.log.info(
      `Server will run on ${config.server.host}:${config.server.port}`,
    );
    fastify.log.info(`Environment: ${config.server.nodeEnv}`);

    // Log enabled providers
    const enabledProviders = Object.entries(config.providers)
      .filter(([_, providerConfig]) => providerConfig.enabled)
      .map(([name]) => name);

    if (enabledProviders.length > 0) {
      fastify.log.info(
        `Enabled OAuth providers: ${enabledProviders.join(", ")}`,
      );
    } else {
      fastify.log.warn("No OAuth providers are enabled");
    }
  },
  {
    name: "config-plugin",
  },
);
