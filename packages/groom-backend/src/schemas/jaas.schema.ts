import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const JaasTokenRequestSchema = z
  .object({
    meetingId: z.string().min(1, "Meeting ID is required"),
  })
  .openapi("JaasTokenRequest");

export const JaasTokenResponseSchema = z
  .object({
    token: z.string(),
    appId: z.string(),
  })
  .openapi("JaasTokenResponse");

export type JaasTokenRequest = z.infer<typeof JaasTokenRequestSchema>;
export type JaasTokenResponse = z.infer<typeof JaasTokenResponseSchema>;
