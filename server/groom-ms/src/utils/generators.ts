import type { User } from "@types";
import { nanoid } from "nanoid";

export const sanitizeUserData = (user: any): User => {
  const { email, name, avatar, id, createdAt, updatedAt, roles } = user;

  // Format roles if they exist (array of objects to array of strings if needed, or keep as is)
  // Based on service logic, roles might be attached.
  // If roles is an array of objects { name: string }, map it.
  const formattedRoles = Array.isArray(roles)
    ? roles.map((r: any) => (typeof r === "string" ? r : r.name))
    : undefined;

  return {
    id,
    email,
    name,
    avatar: avatar || undefined,
    createdAt,
    updatedAt,
    roles: formattedRoles,
  };
};

export const generateSessionId = (): string => nanoid(32);
