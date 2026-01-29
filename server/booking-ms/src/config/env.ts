import z from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3002").transform(Number),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string().default("Groom <noreply@groom.com>"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
