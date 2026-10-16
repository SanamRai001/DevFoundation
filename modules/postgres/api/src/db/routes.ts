import type { Express } from 'express';
import { sql } from 'drizzle-orm';
import { getDatabase } from './client.js';

// Demonstration only. Remove or protect this route if exposing health checks externally.
export function registerDatabaseRoutes(app: Express) {
  app.get('/api/v1/db/health', async (_req, res) => {
    try {
      await getDatabase().execute(sql`select 1`);
      res.json({ status: 'ok', database: 'postgresql' });
    } catch {
      res.status(503).json({
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database is unavailable.' },
      });
    }
  });
}
