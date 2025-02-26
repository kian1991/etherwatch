import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemas from '../schema';
import { POSTGRES_URL } from '../../src/constants';
import { Client, Pool } from 'pg';

// For the running api
const pool = new Pool({
  connectionString: POSTGRES_URL,
  max: 20,
});

// For single queries like migrations and seeding etc
const queryClient = new Client({
  connectionString: POSTGRES_URL,
});

// const db = drizzle({ schema: schemas, client: pool });
const db = drizzle({ client: pool, schema: schemas });

export { queryClient, db };
