import crypto from "node:crypto";
import type { FastifyRequest } from "fastify";
import { nanoid } from "nanoid";
import type { User } from "@types";

export const generateSessionId = (): string => {
  return nanoid(32);
};

export const generateUserId = (): string => {
  return nanoid(21);
};

export const generateTokenId = (): string => {
  return nanoid(32);
};

export const generateState = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateNonce = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const calculateSessionExpiry = (hours: number): Date => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
};

export const isSessionExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

/**
 * Sanitize user object, flattening profile and address fields.
 */
export const sanitizeUserData = (user: any): User => {
  const { id, email, createdAt, updatedAt, roles, profile } = user;

  // Defaults if profile is missing (should not happen for valid users)
  const userProfile = profile || {};

  return {
    id,
    email,
    createdAt,
    updatedAt,
    roles: roles ? roles.map((r: any) => (typeof r === "string" ? r : r.name)) : [],
    
    // Profile Fields
    name: userProfile.name || "Unknown User",
    avatar: userProfile.avatar,
    bio: userProfile.bio,
    phone: userProfile.phone,
    dateOfBirth: userProfile.dateOfBirth,
    gender: userProfile.gender,

    // Address Fields
    street: userProfile.street,
    city: userProfile.city,
    state: userProfile.state,
    zipCode: userProfile.zipCode,
    country: userProfile.country,
  };
};

export const extractDeviceInfo = (userAgent?: string) => {
  if (!userAgent) return "Unknown Device";

  if (userAgent.includes("Mobile")) return "Mobile Device";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
};

/**
 * Extract the user-agent header safely from request headers.
 * Shared helper to avoid duplication across controllers.
 */
export const getUserAgent = (headers: FastifyRequest["headers"]): string | undefined => {
  const userAgent = headers["user-agent"];
  if (Array.isArray(userAgent)) {
    return userAgent[0];
  }
  return userAgent;
};

/**
 * Generate a hashed meeting ID from email and timestamp
 */
export const generateMeetingId = (email: string): string => {
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHash("sha256")
    .update(`${email}-${timestamp}`)
    .digest("hex");
  return hash.substring(0, 12);
};
