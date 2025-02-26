import { defineConfig } from 'drizzle-kit';
import { POSTGRES_URL } from './src/constants';

export default defineConfig({
  schema: ['./db/schema/*'],
  dialect: 'postgresql',
  out: './db/migrations',
  dbCredentials: {
    url: POSTGRES_URL,
  },
});
