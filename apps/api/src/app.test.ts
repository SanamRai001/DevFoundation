import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { healthResponseSchema, errorResponseSchema } from '@devfoundation/contracts';
import { createApp } from './app.js';

describe('API foundation', () => {
  const app = createApp();

  it('returns a contract-compliant health response', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(healthResponseSchema.safeParse(response.body).success).toBe(true);
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('returns a safe 404 JSON error', async () => {
    const response = await request(app).get('/api/v1/missing');
    expect(response.status).toBe(404);
    expect(errorResponseSchema.parse(response.body).error.code).toBe('NOT_FOUND');
  });

  it('rejects malformed JSON with a structured error', async () => {
    const response = await request(app)
      .post('/api/v1/health')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(response.status).toBe(400);
    expect(errorResponseSchema.parse(response.body).error.code).toBe('INVALID_JSON');
  });
});
