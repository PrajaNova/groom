import { z } from "zod";

export const JaasTokenRequestSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
});

export const JaasTokenResponseSchema = z.object({
  token: z.string(),
});

export type JaasTokenRequest = z.infer<typeof JaasTokenRequestSchema>;
export type JaasTokenResponse = z.infer<typeof JaasTokenResponseSchema>;
