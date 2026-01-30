import crypto from "node:crypto";
import { nanoid } from "nanoid";

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

export const sanitizeUserData = (user: any) => {
  const { email, name, avatar, id, createdAt, updatedAt } = user;
  return {
    id,
    email,
    name,
    avatar,
    createdAt,
    updatedAt,
  };
};

export const extractDeviceInfo = (userAgent?: string) => {
  if (!userAgent) return "Unknown Device";

  // Simple device detection
  if (userAgent.includes("Mobile")) return "Mobile Device";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
};
