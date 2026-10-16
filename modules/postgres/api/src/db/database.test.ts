import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { createApp } from '../app.js';
import { closeDatabase, getDatabaseUrl, getDatabase } from './client.js';
import { sampleNotes } from './schema.js';

describe('database URL validation', () => {
  it('rejects missing credentials without exposing a connection string', () => {
    expect(() => getDatabaseUrl({})).toThrow(/DATABASE_URL is required/);
    expect(() => getDatabaseUrl({ DATABASE_URL: 'https://example.com/database' })).toThrow(/PostgreSQL URL/);
  });
});

describe.skipIf(!process.env.TEST_DATABASE_URL)('PostgreSQL integration (disposable DB only)', () => {
  afterAll(async () => {
    await closeDatabase();
  });

  it('queries PostgreSQL and persists an example note after migrations', async () => {
    // Explicit dedicated integration-test URL; never use a production DB here.
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    const app = createApp();
    const health = await request(app).get('/api/v1/db/health');
    expect(health.status).toBe(200);
    expect(health.body.status).toBe('ok');

    const database = getDatabase();
    const title = 'verification-' + crypto.randomUUID();
    const [inserted] = await database.insert(sampleNotes).values({ title }).returning();
    expect(inserted?.title).toBe(title);
    const rows = await database.select().from(sampleNotes).where(eq(sampleNotes.id, inserted!.id));
    expect(rows).toHaveLength(1);
    await database.delete(sampleNotes).where(eq(sampleNotes.id, inserted!.id));
  });
});
