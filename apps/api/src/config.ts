import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
});

export function loadConfig(environment: NodeJS.ProcessEnv = process.env) {
  const result = envSchema.safeParse(environment);
  if (!result.success) {
    throw new Error('Invalid API environment configuration: check HOST, PORT and NODE_ENV.');
  }
  return result.data;
}
