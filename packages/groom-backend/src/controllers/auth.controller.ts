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
		const { code, error, error_description } =
			request.query as OAuthCallbackQuery;

		const query = request.query as any;
		this.fastify.log.info(
			{
				provider,
				hasCode: !!code,
				hasState: !!query.state,
				receivedState: query.state,
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
				{ provider, method: AUTH_METHODS.OAUTH },
				user.id,
				request.ip,
				getUserAgent(request.headers),
			);

			const frontendUrl = this.fastify.config.security.frontendUrl;
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

	async handleGithubCallback(request: FastifyRequest, reply: FastifyReply) {
		return this.handleOAuthCallback(
			PROVIDERS.GITHUB,
			request,
			reply,
			this.fastify.githubOAuth2,
			async (token) => {
				const data = await this.fetchOAuthUserInfo(
					API_ENDPOINTS.GITHUB_USER,
					token.token.access_token,
					{ [HTTP_HEADERS.USER_AGENT]: USER_AGENT.GITHUB },
				);

				let email = data.email;
				if (!email) {
					const emails = (await this.fetchOAuthUserInfo(
						API_ENDPOINTS.GITHUB_USER_EMAILS,
						token.token.access_token,
						{ [HTTP_HEADERS.USER_AGENT]: USER_AGENT.GITHUB },
					)) as unknown as ProviderEmail[];
					const primaryEmail = emails.find((e) => e.primary);
					email = primaryEmail?.email || emails[0]?.email;
				}

				return {
					id: String(data.id),
					email: email || MISC.EMPTY_STRING,
					name: data.name || data.login || MISC.EMPTY_STRING,
					avatar: data.avatar_url || MISC.EMPTY_STRING,
				};
			},
		);
	}

	async handleFacebookCallback(request: FastifyRequest, reply: FastifyReply) {
		return this.handleOAuthCallback(
			PROVIDERS.FACEBOOK,
			request,
			reply,
			this.fastify.facebookOAuth2,
			async (token) => {
				const data = await this.fetchOAuthUserInfo(
					`${API_ENDPOINTS.FACEBOOK_ME}?fields=${API_ENDPOINTS.FACEBOOK_FIELDS}&access_token=${token.token.access_token}`,
					MISC.EMPTY_STRING,
				);
				return {
					id: data.id,
					email: data.email,
					name: data.name || MISC.EMPTY_STRING,
					avatar:
						(typeof data.picture === "object" && data.picture?.data?.url) ||
						MISC.EMPTY_STRING,
				};
			},
		);
	}

	async handleDiscordCallback(request: FastifyRequest, reply: FastifyReply) {
		return this.handleOAuthCallback(
			PROVIDERS.DISCORD,
			request,
			reply,
			this.fastify.discordOAuth2,
			async (token) => {
				const data = await this.fetchOAuthUserInfo(
					API_ENDPOINTS.DISCORD_USER,
					token.token.access_token,
				);
				return {
					id: data.id,
					email: data.email,
					name: data.username || MISC.EMPTY_STRING,
					avatar: data.avatar
						? `${API_ENDPOINTS.DISCORD_CDN_AVATAR}/${data.id}/${data.avatar}.png`
						: MISC.EMPTY_STRING,
				};
			},
		);
	}

	async handleLinkedinCallback(request: FastifyRequest, reply: FastifyReply) {
		return this.handleOAuthCallback(
			PROVIDERS.LINKEDIN,
			request,
			reply,
			this.fastify.linkedinOAuth2,
			async (token) => {
				const data = (await this.fetchOAuthUserInfo(
					API_ENDPOINTS.LINKEDIN_USERINFO,
					token.token.access_token,
				)) as any;
				return {
					id: data.sub,
					email: data.email,
					name: data.name || MISC.EMPTY_STRING,
					avatar: data.picture || MISC.EMPTY_STRING,
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
				getUserAgent(request.headers),
			);

			return reply.code(201).send({
				success: true,
				user,
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
				getUserAgent(request.headers),
			);

			return reply.send({
				success: true,
				user,
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

		const sessionService = new SessionService(this.fastify);
		await sessionService.deleteSession(request.session.sessionId);

		reply.clearCookie(COOKIE_CONFIG.SESSION_NAME);

		const auditService = new AuditService(this.fastify);
		await auditService.log(
			AUDIT_EVENTS.LOGOUT,
			{ sessionId: request.session.sessionId },
			request.user.id,
			request.ip,
			getUserAgent(request.headers),
		);

		return { success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS };
	}
}
