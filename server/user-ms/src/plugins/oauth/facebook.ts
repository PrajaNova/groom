import {
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauthPlugin from "@fastify/oauth2";
import fp from "fastify-plugin";

/**
 * Facebook OAuth2 plugin
 * @see https://github.com/fastify/fastify-oauth2
 */
export default fp(async (fastify) => {
  const config = fastify.config.providers.facebook;

  if (!config.enabled) {
    fastify.log.info(PLUGIN_LOG_MESSAGES.FACEBOOK_DISABLED);
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    fastify.log.warn(PLUGIN_LOG_MESSAGES.FACEBOOK_MISSING_CREDS);
    return;
  }

  await fastify.register(oauthPlugin, {
    name: OAUTH_PLUGIN_NAMES.FACEBOOK,
    scope: config.scopes,
    credentials: {
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: OAUTH_START_PATHS.FACEBOOK,
    callbackUri: config.callbackUrl,
  });

  fastify.log.info(PLUGIN_LOG_MESSAGES.FACEBOOK_REGISTERED);
});
