import {
  API_ENDPOINTS,
  AUDIT_EVENTS,
  AUTH_METHODS,
  COOKIE_CONFIG,
  ENV,
  ERROR_MESSAGES,
  HTTP_HEADERS,
  LOG_MESSAGES,
  MISC,
  type OAuthToken,
  PROVIDER_DISPLAY_NAMES,
  PROVIDER_ICONS,
  PROVIDERS,
  type ProviderEmail,
  type ProviderUserInfo,
  SUCCESS_MESSAGES,
  USER_AGENT,
} from "@constants";
import type { OAuth2Namespace } from "@fastify/oauth2";
import { AuditService } from "@services/audit.service";
import { SessionService } from "@services/session.service";
import { TokenService } from "@services/token.service";
import { UserService } from "@services/user.service";
import type { OAuthCallbackQuery, ProviderInfo } from "@types";
import { getUserAgent } from "@utils/generators";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
  constructor(private fastify: FastifyInstance) {}

  // GET /auth/providers - List all enabled providers
  async getProviders(_request: FastifyRequest, _reply: FastifyReply) {
    const providers: ProviderInfo[] = [];
    const config = this.fastify.config.providers;

    if (config.google.enabled) {
      providers.push({
        name: PROVIDERS.GOOGLE,
        displayName: PROVIDER_DISPLAY_NAMES[PROVIDERS.GOOGLE],
        icon: PROVIDER_ICONS[PROVIDERS.GOOGLE],
        enabled: true,
      });
    }

    if (config.facebook.enabled) {
      providers.push({
        name: PROVIDERS.FACEBOOK,
        displayName: PROVIDER_DISPLAY_NAMES[PROVIDERS.FACEBOOK],
        icon: PROVIDER_ICONS[PROVIDERS.FACEBOOK],
        enabled: true,
      });
    }

    if (config.github.enabled) {
      providers.push({
        name: PROVIDERS.GITHUB,
        displayName: PROVIDER_DISPLAY_NAMES[PROVIDERS.GITHUB],
        icon: PROVIDER_ICONS[PROVIDERS.GITHUB],
        enabled: true,
      });
    }

    if (config.discord.enabled) {
      providers.push({
        name: PROVIDERS.DISCORD,
        displayName: PROVIDER_DISPLAY_NAMES[PROVIDERS.DISCORD],
        icon: PROVIDER_ICONS[PROVIDERS.DISCORD],
        enabled: true,
      });
    }

    if (config.linkedin.enabled) {
      providers.push({
        name: PROVIDERS.LINKEDIN,
        displayName: PROVIDER_DISPLAY_NAMES[PROVIDERS.LINKEDIN],
        icon: PROVIDER_ICONS[PROVIDERS.LINKEDIN],
        enabled: true,
      });
    }

    if (config.custom.enabled) {
      providers.push({
        name: PROVIDERS.CUSTOM,
        displayName:
          config.custom.name || PROVIDER_DISPLAY_NAMES[PROVIDERS.CUSTOM],
        icon: PROVIDER_ICONS[PROVIDERS.CUSTOM],
        enabled: true,
      });
    }

    return {
      providers,
      branding: this.fastify.config.branding,
    };
  }

  // Helper to fetch user info from OAuth provider
  private async fetchOAuthUserInfo(
    url: string,
    accessToken: string,
    extraHeaders?: Record<string, string>,
  ): Promise<ProviderUserInfo> {
    const response = await fetch(url, {
      headers: {
        [HTTP_HEADERS.AUTHORIZATION]: `${MISC.BEARER_PREFIX} ${accessToken}`,
        ...extraHeaders,
      },
    });
    return (await response.json()) as ProviderUserInfo;
  }

  // Generic OAuth callback handler
  async handleOAuthCallback(
    provider: string,
    request: FastifyRequest,
    reply: FastifyReply,
    oauthClient: OAuth2Namespace | undefined,
    getUserInfo: (token: OAuthToken) => Promise<ProviderUserInfo>,
  ) {
    const query = request.query as any;
    const { code, error, error_description, state: receivedState } = query;

    this.fastify.log.info(
      {
        provider,
        hasCode: !!code,
        hasState: !!receivedState,
        receivedState,
        callbackUrl: this.fastify.config.providers[provider as keyof typeof this.fastify.config.providers]?.callbackUrl,
        cookies: Object.keys(request.cookies),
      },
      LOG_MESSAGES.OAUTH_CALLBACK_RECEIVED,
    );

    if (error) {
      this.fastify.log.error(
        { error, error_description },
        `${provider} OAuth error`,
      );
      return reply.badRequest(error_description || error);
    }

    if (!code) {
      return reply.badRequest(ERROR_MESSAGES.MISSING_CODE);
    }

    try {
      const token =
        await oauthClient?.getAccessTokenFromAuthorizationCodeFlow(request);

      if (!token) {
        return reply.badRequest(ERROR_MESSAGES.MISSING_TOKEN);
      }

      const userInfo = await getUserInfo(token);

      const userService = new UserService(this.fastify);
      const user = await userService.findOrCreateUser(
        userInfo.email,
        userInfo.name || MISC.EMPTY_STRING,
        userInfo.avatar || MISC.EMPTY_STRING,
        provider,
        userInfo.id,
        { token: token.token },
      );

      const tokenService = new TokenService(this.fastify);
      await tokenService.storeToken(
        user.id,
        provider,
        token.token.access_token,
        token.token.refresh_token,
        token.token.expires_in,
      );

      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        getUserAgent(request.headers),
        request.ip,
      );

      const jwt = await sessionService.generateJWT(session);

      const isProd = this.fastify.config.server.nodeEnv === ENV.PRODUCTION;
      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge:
          this.fastify.config.security.sessionExpiryHours *
          MISC.SECONDS_PER_HOUR,
        path: COOKIE_CONFIG.PATH,
      });

      const auditService = new AuditService(this.fastify);
      await auditService.log(
        AUDIT_EVENTS.LOGIN,
        { provider, method: AUTH_METHODS.OAUTH },
        user.id,
        request.ip,
        getUserAgent(request.headers),
      );

      const frontendUrl = this.fastify.config.security.frontendUrl;
      const query = request.query as any;
      const state = query.state;

      if (
        state &&
        typeof state === "string" &&
        state.startsWith("/") &&
        !state.startsWith("//")
      ) {
        this.fastify.log.info(
          {
            provider,
            state,
            frontendUrl,
          },
          LOG_MESSAGES.REDIRECTING_TO_FRONTEND,
        );
        return reply.redirect(`${frontendUrl}${state}`);
      }

      this.fastify.log.info(
        {
          provider,
          frontendUrl,
        },
        LOG_MESSAGES.REDIRECTING_TO_FRONTEND,
      );

      return reply.redirect(`${frontendUrl}/?auth=success`);
    } catch (error: any) {
      this.fastify.log.error(
        {
          provider,
          error: error.message,
          stack: error.stack,
          response: error.response?.data || error.response?.body,
        },
        `${provider} OAuth callback error`,
      );

      try {
        const auditService = new AuditService(this.fastify);
        await auditService.log(
          AUDIT_EVENTS.LOGIN,
          {
            provider,
            method: AUTH_METHODS.OAUTH,
            success: false,
            error: String(error.message || error),
          },
          undefined,
          request.ip,
          getUserAgent(request.headers),
        );
      } catch (auditError) {
        this.fastify.log.error(auditError, "Failed to log audit event");
      }

      return reply.internalServerError(ERROR_MESSAGES.AUTH_FAILED_MESSAGE);
    }
  }

  async handleGoogleCallback(request: FastifyRequest, reply: FastifyReply) {
    return this.handleOAuthCallback(
      PROVIDERS.GOOGLE,
      request,
      reply,
      this.fastify.googleOAuth2,
      async (token) => {
        const data = await this.fetchOAuthUserInfo(
          API_ENDPOINTS.GOOGLE_USERINFO,
          token.token.access_token,
        );
        return {
          id: data.id,
          email: data.email,
          name: data.name || MISC.EMPTY_STRING,
          avatar:
            typeof data.picture === "string" ? data.picture : MISC.EMPTY_STRING,
        };
      },
    );
  }
  
  // POST /auth/register
  async handleRegister(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name, avatar } = request.body as {
      email?: string;
      password?: string;
      name?: string;
      avatar?: string;
    };

    if (!email || !password || !name) {
      return reply.badRequest(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.badRequest(ERROR_MESSAGES.INVALID_EMAIL);
    }

    if (password.length < 8) {
      return reply.badRequest(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return reply.badRequest(ERROR_MESSAGES.WEAK_PASSWORD);
    }

    try {
      const userService = new UserService(this.fastify);

      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return reply.conflict(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      const user = await userService.createLocalUser({
        email,
        password,
        name,
        avatar,
      });

      await userService.linkProviderAccount(
        user.id,
        PROVIDERS.CUSTOM,
        user.id,
        { method: AUTH_METHODS.LOCAL },
      );

      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        getUserAgent(request.headers),
        request.ip,
      );

      const jwt = await sessionService.generateJWT(session);

      const isProd = this.fastify.config.server.nodeEnv === ENV.PRODUCTION;
      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge:
          this.fastify.config.security.sessionExpiryHours *
          MISC.SECONDS_PER_HOUR,
        path: COOKIE_CONFIG.PATH,
      });

      const auditService = new AuditService(this.fastify);
      await auditService.log(
        AUDIT_EVENTS.REGISTER,
        { method: AUTH_METHODS.LOCAL },
        user.id,
        request.ip,
        getUserAgent(request.headers),
      );

      return reply.code(201).send({
        success: true,
        user,
        token: jwt,
        message: "Registration successful",
      });
    } catch (error) {
      this.fastify.log.error(error, "Registration error");
      return reply.internalServerError("Registration failed");
    }
  }

  // POST /auth/login
  async handleLogin(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return reply.badRequest(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    try {
      const userService = new UserService(this.fastify);

      const user = await userService.verifyPassword(email, password);
      if (!user) {
        const auditService = new AuditService(this.fastify);
        await auditService.log(
          AUDIT_EVENTS.LOGIN_FAILED,
          { method: AUTH_METHODS.LOCAL, email },
          undefined,
          request.ip,
          getUserAgent(request.headers),
        );

        return reply.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        getUserAgent(request.headers),
        request.ip,
      );

      const jwt = await sessionService.generateJWT(session);

      const isProd = this.fastify.config.server.nodeEnv === ENV.PRODUCTION;
      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge:
          this.fastify.config.security.sessionExpiryHours *
          MISC.SECONDS_PER_HOUR,
        path: COOKIE_CONFIG.PATH,
      });

      const auditService = new AuditService(this.fastify);
      await auditService.log(
        AUDIT_EVENTS.LOGIN,
        { method: AUTH_METHODS.LOCAL },
        user.id,
        request.ip,
        getUserAgent(request.headers),
      );

      return reply.send({
        success: true,
        user,
        token: jwt,
        message: SUCCESS_MESSAGES.AUTH_SUCCESS,
      });
    } catch (error) {
      this.fastify.log.error(error, "Login error");
      return reply.internalServerError("Login failed");
    }
  }

  // POST /auth/logout
  async handleLogout(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user || !request.session) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userId = request.user.id;
    const sessionId = request.session.sessionId;

    // Delete session from database
    const sessionService = new SessionService(this.fastify);
    await sessionService.deleteSession(sessionId);

    // Delete provider tokens (Google, etc.) to ensure fresh login next time
    const tokenService = new TokenService(this.fastify);
    await tokenService.deleteUserTokens(userId);

    reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);

    const auditService = new AuditService(this.fastify);
    await auditService.log(
      AUDIT_EVENTS.LOGOUT,
      { sessionId },
      userId,
      request.ip,
      getUserAgent(request.headers),
    );

    return { success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS };
  }
}
