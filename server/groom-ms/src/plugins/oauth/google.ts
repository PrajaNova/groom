import {
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauth2, { type FastifyOAuth2Options } from "@fastify/oauth2";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(
  async (fastify: FastifyInstance) => {
    const config = fastify.config.providers.google;

    if (!config.enabled) {
      fastify.log.debug(PLUGIN_LOG_MESSAGES.GOOGLE_DISABLED);
      return;
    }

    if (!config.clientId || !config.clientSecret) {
      fastify.log.warn(PLUGIN_LOG_MESSAGES.GOOGLE_MISSING_CREDS);
      return;
    }

    const options: FastifyOAuth2Options = {
      name: OAUTH_PLUGIN_NAMES.GOOGLE,
      credentials: {
        client: {
          id: config.clientId,
          secret: config.clientSecret,
        },
        auth: oauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: OAUTH_START_PATHS.GOOGLE,
      callbackUri: config.callbackUrl,
      scope: config.scopes,
    };

    await fastify.register(oauth2, options);
    fastify.log.info(PLUGIN_LOG_MESSAGES.GOOGLE_REGISTERED);
  },
  {
    name: "auth-google-plugin",
    dependencies: ["config-plugin"],
  },
);
