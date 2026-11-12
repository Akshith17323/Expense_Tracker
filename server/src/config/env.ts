import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().min(1).default("*"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
}

export const env = result.data;
