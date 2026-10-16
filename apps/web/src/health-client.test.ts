import { describe, expect, it } from 'vitest';
import { fetchHealth } from './health-client.js';

describe('health client', () => {
  it('validates a healthy API response', async () => {
    const result = await fetchHealth(undefined, async () => {
      return new Response(
        JSON.stringify({ status: 'ok', service: 'api', timestamp: '2026-10-16T00:00:00.000Z' }),
        { status: 200 },
      );
    });
    expect(result.status).toBe('ok');
  });

  it('rejects invalid response content', async () => {
    await expect(
      fetchHealth(undefined, async () => new Response(JSON.stringify({ status: 'fake' }))),
    ).rejects.toThrow();
  });

  it('does not disguise HTTP failures as healthy responses', async () => {
    await expect(
      fetchHealth(undefined, async () => new Response('{}', { status: 503 })),
    ).rejects.toThrow('API responded with an error.');
  });
});
