import { useEffect, useState, type FormEvent } from 'react';
import { createNoteSchema, noteListSchema, noteSchema, type Note } from '@devfoundation/contracts';

async function api(url: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (response.status === 204) return undefined;
  if (!response.ok) throw new Error('The request failed. Check your API and try again.');
  return response.json() as Promise<unknown>;
}

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    const data = await api('/api/v1/notes');
    setNotes(noteListSchema.parse(data));
  }

  useEffect(() => {
    let live = true;
    api('/api/v1/notes').then((data) => {
      if (live) setNotes(noteListSchema.parse(data));
    }).catch(() => {
      if (live) setError('Cannot load notes. Check PostgreSQL, migrations and the API.');
    }).finally(() => {
      if (live) setLoading(false);
    });
    return () => { live = false; };
  }, []);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    try { await action(); }
    catch { setError('Something went wrong. Your changes may not have been saved.'); }
    finally { setBusy(false); }
  }

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createNoteSchema.safeParse({ title });
    if (!parsed.success) {
      setError('Please enter a note title (1–120 characters).');
      return;
    }
    await run(async () => {
      noteSchema.parse(await api('/api/v1/notes', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      }));
      setTitle('');
      await load();
    });
  }

  async function toggle(note: Note) {
    await run(async () => {
      noteSchema.parse(await api('/api/v1/notes/' + note.id, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !note.completed }),
      }));
      await load();
    });
  }

  async function remove(note: Note) {
    await run(async () => {
      await api('/api/v1/notes/' + note.id, { method: 'DELETE' });
      await load();
    });
  }

  return (
    <main className="app">
      <header>
        <p className="eyebrow">DEVFOUNDATION / LEARNING EXAMPLE</p>
        <h1>My Notes</h1>
        <p className="intro">A real React ↔ Express ↔ PostgreSQL example. Add a note, mark it done, or delete it.</p>
      </header>
      <section aria-label="Your notes" className="panel">
        <form onSubmit={(event) => { void add(event); }}>
          <label htmlFor="title">New note</label>
          <div className="form-row">
            <input id="title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build my first full-stack app" disabled={busy} />
            <button type="submit" disabled={busy || title.trim().length === 0}>Add note</button>
          </div>
        </form>
        {error && <p role="alert" className="error">{error}</p>}
        {loading ? <p role="status">Loading your notes…</p> : (
          notes.length === 0 ? <p className="empty">Nothing here yet. Write your first note above.</p> : (
            <ul>{notes.map((note) => (
              <li key={note.id}>
                <label className="note-label">
                  <input type="checkbox" checked={note.completed} disabled={busy}
                    onChange={() => { void toggle(note); }}/>
                  <span className={note.completed ? 'done' : ''}>{note.title}</span>
                </label>
                <button type="button" disabled={busy} className="delete"
                  onClick={() => { void remove(note); }} aria-label={'Delete ' + note.title}>Delete</button>
              </li>
            ))}</ul>
          )
        )}
      </section>
      <p className="foot">Teaching example — no login or user isolation. Do not publish personal notes here.</p>
    </main>
  );
}
