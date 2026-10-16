import { healthResponseSchema, type HealthResponse } from '@devfoundation/contracts';

export async function fetchHealth(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<HealthResponse> {
  const response = await fetcher('/api/v1/health', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error('API responded with an error.');
  }

  return healthResponseSchema.parse(await response.json());
}
