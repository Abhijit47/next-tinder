import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';
import { env } from './env';

loadEnvConfig(process.cwd(), true);

export default defineConfig({
  schema: ['./drizzle/schemas.ts'],
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
