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
  type ProviderUserInfo,
  SUCCESS_MESSAGES,
} from "@constants";
import type { OAuth2Namespace } from "@fastify/oauth2";
import { AuditService } from "@services/audit.service";
import { SessionService } from "@services/session.service";
import { TokenService } from "@services/token.service";
import { UserService } from "@services/user.service";
import type { OAuthCallbackQuery, ProviderInfo } from "@types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
  constructor(private fastify: FastifyInstance) {}

  // Helper to extract user-agent header safely
  private getUserAgent(headers: FastifyRequest["headers"]): string | undefined {
    const userAgent = headers[HTTP_HEADERS.USER_AGENT.toLowerCase()];
    if (Array.isArray(userAgent)) {
      return userAgent[0];
    }
    return userAgent;
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

    return {
      providers,
      branding: this.fastify.config.branding,
    };
  }

  // Generic OAuth callback handler
  async handleOAuthCallback(
    provider: string,
    request: FastifyRequest,
    reply: FastifyReply,
    oauthClient: OAuth2Namespace | undefined,
    getUserInfo: (token: OAuthToken) => Promise<ProviderUserInfo>,
  ) {
    const { code, error, error_description } =
      request.query as OAuthCallbackQuery;

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
      // Exchange code for token
      const token =
        await oauthClient?.getAccessTokenFromAuthorizationCodeFlow(request);

      if (!token) {
        return reply.badRequest(ERROR_MESSAGES.MISSING_TOKEN);
      }

      // Get user info from provider
      const userInfo = await getUserInfo(token);

      // Create or update user
      const userService = new UserService(this.fastify);
      const user = await userService.findOrCreateUser(
        userInfo.email,
        userInfo.name || MISC.EMPTY_STRING,
        userInfo.avatar || MISC.EMPTY_STRING,
        provider,
        userInfo.id,
        { token: token.token },
      );

      // Store provider token (hashed)
      const tokenService = new TokenService(this.fastify);
      await tokenService.storeToken(
        user.id,
        provider,
        token.token.access_token,
        token.token.refresh_token,
        token.token.expires_in,
      );

      // Create session
      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        this.getUserAgent(request.headers),
        request.ip,
      );

      // Generate JWT
      const jwt = await sessionService.generateJWT(session);

      // Set session cookie
      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: this.fastify.config.server.nodeEnv === ENV.PRODUCTION,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        maxAge:
          this.fastify.config.security.sessionExpiryHours *
          MISC.SECONDS_PER_HOUR,
        path: COOKIE_CONFIG.PATH,
      });

      // Audit log
      const auditService = new AuditService(this.fastify);
      await auditService.log(
        AUDIT_EVENTS.LOGIN,
        { provider, method: AUTH_METHODS.OAUTH },
        user.id,
        request.ip,
        this.getUserAgent(request.headers),
      );

      // Redirect to frontend with success parameter
      const frontendUrl = this.fastify.config.security.frontendUrl;
      return reply.redirect(`${frontendUrl}/?auth=success`);
    } catch (error: any) {
      this.fastify.log.error(error, "OAuth callback error");
      return reply.internalServerError(ERROR_MESSAGES.AUTH_FAILED_MESSAGE);
    }
  }

  // Google OAuth callback handler
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

  // POST /auth/register - Register new user with email/password
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

      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        this.getUserAgent(request.headers),
        request.ip,
      );

      const jwt = await sessionService.generateJWT(session);

      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: this.fastify.config.server.nodeEnv === ENV.PRODUCTION,
        sameSite: COOKIE_CONFIG.SAME_SITE,
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
        this.getUserAgent(request.headers),
      );

      return reply.send({
        success: true,
        user,
        message: "Registration successful",
        sessionToken: jwt,
      });
    } catch (error) {
      // Handle error
      return reply.internalServerError("Registration failed");
    }
  }

  // POST /auth/login - Login with email/password
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
        return reply.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const sessionService = new SessionService(this.fastify);
      const session = await sessionService.createSession(
        user.id,
        this.getUserAgent(request.headers),
        request.ip,
      );

      const jwt = await sessionService.generateJWT(session);

      reply.setCookie(COOKIE_CONFIG.SESSION_NAME, jwt, {
        httpOnly: true,
        secure: this.fastify.config.server.nodeEnv === ENV.PRODUCTION,
        sameSite: COOKIE_CONFIG.SAME_SITE,
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
        this.getUserAgent(request.headers),
      );

      return reply.send({
        success: true,
        user,
        message: SUCCESS_MESSAGES.AUTH_SUCCESS,
        sessionToken: jwt,
      });
    } catch (error) {
      return reply.internalServerError("Login failed");
    }
  }

  // POST /logout - Logout and invalidate current session
  async handleLogout(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user || !request.session) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const sessionService = new SessionService(this.fastify);
    await sessionService.deleteSession(request.session.sessionId);

    reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);

    const auditService = new AuditService(this.fastify);
    await auditService.log(
      AUDIT_EVENTS.LOGOUT,
      { sessionId: request.session.sessionId },
      request.user.id,
      request.ip,
      this.getUserAgent(request.headers),
    );

    return { success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS };
  }

  async handleMe(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }
    return reply.send({
      success: true,
      user: request.user,
    });
  }
}
