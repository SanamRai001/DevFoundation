import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createNoteSchema, noteListSchema, noteSchema } from '@devfoundation/contracts';
import { createApp } from './app.js';

describe('Notes learning example with no database', () => {
  const app = createApp();

  it('validates untrusted input with shared Zod contracts', async () => {
    expect(createNoteSchema.safeParse({ title: '  ' }).success).toBe(false);
    const empty = await request(app).post('/api/v1/notes').send({ title: '' });
    expect(empty.status).toBe(400);
    const tooLong = await request(app).post('/api/v1/notes').send({ title: 'x'.repeat(121) });
    expect(tooLong.status).toBe(400);
  });

  it('creates, lists, completes and removes notes over HTTP', async () => {
    const created = await request(app).post('/api/v1/notes').send({ title: 'Learn Express' });
    expect(created.status).toBe(201);
    const note = noteSchema.parse(created.body);
    const list = await request(app).get('/api/v1/notes');
    expect(list.status).toBe(200);
    expect(noteListSchema.parse(list.body)).toContainEqual(note);

    const patched = await request(app).patch('/api/v1/notes/' + note.id).send({ completed: true });
    expect(patched.status).toBe(200);
    expect(noteSchema.parse(patched.body).completed).toBe(true);
    expect((await request(app).patch('/api/v1/notes/' + note.id).send({ completed: 'yes' })).status).toBe(400);
    expect((await request(app).get('/api/v1/notes')).body[0].completed).toBe(true);

    expect((await request(app).delete('/api/v1/notes/' + note.id)).status).toBe(204);
    expect((await request(app).delete('/api/v1/notes/' + note.id)).status).toBe(404);
    expect((await request(app).patch('/api/v1/notes/bad').send({ completed: true })).status).toBe(400);
  });

  it('starts every app with fresh memory, and never stores data on disk', async () => {
    const fresh = await request(createApp()).get('/api/v1/notes');
    expect(fresh.status).toBe(200);
    expect(fresh.body).toEqual([]);
  });
});
