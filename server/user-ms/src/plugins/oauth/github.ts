import {
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauthPlugin from "@fastify/oauth2";
import fp from "fastify-plugin";

/**
 * GitHub OAuth2 plugin
 * @see https://github.com/fastify/fastify-oauth2
 */
export default fp(async (fastify) => {
  const config = fastify.config.providers.github;

  if (!config.enabled) {
    fastify.log.info(PLUGIN_LOG_MESSAGES.GITHUB_DISABLED);
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    fastify.log.warn(PLUGIN_LOG_MESSAGES.GITHUB_MISSING_CREDS);
    return;
  }

  await fastify.register(oauthPlugin, {
    name: OAUTH_PLUGIN_NAMES.GITHUB,
    scope: config.scopes,
    credentials: {
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION,
    },
    startRedirectPath: OAUTH_START_PATHS.GITHUB,
    callbackUri: config.callbackUrl,
  });

  fastify.log.info(PLUGIN_LOG_MESSAGES.GITHUB_REGISTERED);
});
