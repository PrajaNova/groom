import {
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauthPlugin from "@fastify/oauth2";
import fp from "fastify-plugin";

/**
 * Google OAuth2 plugin
 */
export default fp(async (fastify) => {
  const config = fastify.config.providers.google;

  if (!config.enabled) {
    fastify.log.info(PLUGIN_LOG_MESSAGES.GOOGLE_DISABLED);
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    fastify.log.warn(PLUGIN_LOG_MESSAGES.GOOGLE_MISSING_CREDS);
    return;
  }

  await fastify.register(oauthPlugin, {
    name: OAUTH_PLUGIN_NAMES.GOOGLE,
    scope: config.scopes,
    credentials: {
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: OAUTH_START_PATHS.GOOGLE,
    callbackUri: config.callbackUrl,
  });

  fastify.log.info(PLUGIN_LOG_MESSAGES.GOOGLE_REGISTERED);
});
