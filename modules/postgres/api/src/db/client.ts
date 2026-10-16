import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

let pool: Pool | undefined;
let database: ReturnType<typeof drizzle> | undefined;

export function getDatabaseUrl(environment: NodeJS.ProcessEnv = process.env): string {
  const raw = environment.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is required for the PostgreSQL module.');
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
  if (!['postgresql:', 'postgres:'].includes(parsed.protocol) || !parsed.hostname || !parsed.pathname.slice(1)) {
    throw new Error('DATABASE_URL must be a PostgreSQL URL with a host and database name.');
  }
  return raw;
}

export function getDatabase() {
  if (!database) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
    });
    database = drizzle({ client: pool });
  }
  return database;
}

export async function closeDatabase() {
  const current = pool;
  pool = undefined;
  database = undefined;
  if (current) await current.end();
}
