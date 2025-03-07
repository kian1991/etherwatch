import { Context, Env } from 'hono';
import { ZodError } from 'zod';

export const withErrorHandler =
  <T extends Env>(fn: (c: Context<T>) => Promise<Response>) =>
  async (c: Context<T>) => {
    try {
      return await fn(c);
    } catch (error) {
      console.error(error);

      // handle validation error
      if (error instanceof ZodError)
        return c.json({ error: error.format() }, 400);

      if (error instanceof SyntaxError) {
        // handle syntax error
        return c.json({ error: 'Invalid JSON' }, 400);
      }

      if (error instanceof Error && 'code' in error) {
        const pgError = error as { code?: string };

        switch (pgError.code) {
          case 'ECONNREFUSED':
            return c.json({ error: 'Database connection refused' }, 500);
          case 'ENOTFOUND':
            return c.json({ error: 'Database host not found' }, 500);
          case '23505':
            return c.json({ error: 'Duplicate key' }, 409);
          case 'ECONNRESET':
            return c.json({ error: 'Database connection reset' }, 500);
          default:
            return c.json({ error: 'Internal server error' }, 500);
        }
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  };
