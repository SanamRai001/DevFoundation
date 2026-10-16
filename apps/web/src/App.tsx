import { useEffect, useState } from 'react';
import { fetchHealth } from './health-client.js';

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; checkedAt: string }
  | { kind: 'error' };

export function App() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setStatus({ kind: 'loading' });

    fetchHealth(controller.signal)
      .then((result) => {
        if (active) setStatus({ kind: 'ready', checkedAt: result.timestamp });
      })
      .catch(() => {
        if (active) setStatus({ kind: 'error' });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  return (
    <main className="shell">
      <div className="eyebrow">DEVFOUNDATION / STARTER</div>
      <h1>A clean place to start.</h1>
      <p className="intro">
        React, Express and shared TypeScript contracts. This page is a replaceable connectivity
        check, not a dashboard to maintain.
      </p>
      <section className="status-card" aria-labelledby="connection-heading">
        <div className="card-heading">
          <h2 id="connection-heading">API connectivity</h2>
          <span className={'status-indicator ' + status.kind} aria-hidden="true" />
        </div>
        <div role="status" aria-live="polite">
          {status.kind === 'loading' && <p>Checking the API…</p>}
          {status.kind === 'ready' && (
            <p>
              Connected. Health response verified.
              <small>Last checked: {new Date(status.checkedAt).toLocaleString()}</small>
            </p>
          )}
          {status.kind === 'error' && (
            <div>
              <p>Cannot reach the API. Confirm the backend is running.</p>
              <button type="button" onClick={() => setAttempt((current) => current + 1)}>
                Try again
              </button>
            </div>
          )}
        </div>
      </section>
      <p className="footer-note">Replace this example with your first real vertical slice.</p>
    </main>
  );
}
