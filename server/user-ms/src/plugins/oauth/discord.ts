import {
  DISCORD_OAUTH_CONFIG,
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauthPlugin from "@fastify/oauth2";
import fp from "fastify-plugin";

/**
 * Discord OAuth2 plugin
 * @see https://github.com/fastify/fastify-oauth2
 */
export default fp(async (fastify) => {
  const config = fastify.config.providers.discord;

  if (!config.enabled) {
    fastify.log.info(PLUGIN_LOG_MESSAGES.DISCORD_DISABLED);
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    fastify.log.warn(PLUGIN_LOG_MESSAGES.DISCORD_MISSING_CREDS);
    return;
  }

  await fastify.register(oauthPlugin, {
    name: OAUTH_PLUGIN_NAMES.DISCORD,
    scope: config.scopes,
    credentials: {
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: {
        authorizeHost: DISCORD_OAUTH_CONFIG.AUTHORIZE_HOST,
        authorizePath: DISCORD_OAUTH_CONFIG.AUTHORIZE_PATH,
        tokenHost: DISCORD_OAUTH_CONFIG.TOKEN_HOST,
        tokenPath: DISCORD_OAUTH_CONFIG.TOKEN_PATH,
      },
    },
    startRedirectPath: OAUTH_START_PATHS.DISCORD,
    callbackUri: config.callbackUrl,
  });

  fastify.log.info(PLUGIN_LOG_MESSAGES.DISCORD_REGISTERED);
});
