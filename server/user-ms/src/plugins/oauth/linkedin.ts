import {
  OAUTH_PLUGIN_NAMES,
  OAUTH_START_PATHS,
  PLUGIN_LOG_MESSAGES,
} from "@constants";
import oauthPlugin from "@fastify/oauth2";
import fp from "fastify-plugin";

/**
 * LinkedIn OAuth2 plugin
 * LinkedIn requires client credentials in the request body, not as Basic Auth header
 * @see https://github.com/fastify/fastify-oauth2
 * @see https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
 */
export default fp(async (fastify) => {
  const config = fastify.config.providers.linkedin;

  if (!config.enabled) {
    fastify.log.info(PLUGIN_LOG_MESSAGES.LINKEDIN_DISABLED);
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    fastify.log.warn(PLUGIN_LOG_MESSAGES.LINKEDIN_MISSING_CREDS);
    return;
  }

  await fastify.register(oauthPlugin, {
    name: OAUTH_PLUGIN_NAMES.LINKEDIN,
    scope: config.scopes,
    credentials: {
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: {
        authorizeHost: "https://www.linkedin.com",
        authorizePath: "/oauth/v2/authorization",
        tokenHost: "https://www.linkedin.com",
        tokenPath: "/oauth/v2/accessToken",
      },
      // LinkedIn requires credentials in body, not as Basic Auth header
      options: {
        authorizationMethod: "body",
      },
    },
    startRedirectPath: OAUTH_START_PATHS.LINKEDIN,
    callbackUri: config.callbackUrl,
  });

  fastify.log.info(PLUGIN_LOG_MESSAGES.LINKEDIN_REGISTERED);
});
