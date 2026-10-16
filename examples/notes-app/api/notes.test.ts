import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createNoteSchema, noteListSchema, noteSchema } from '@devfoundation/contracts';
import { createApp } from './app.js';
import { closeDatabase } from './db/client.js';

describe('notes input validation (does not require a database)', () => {
  const app = createApp();
  it('rejects empty and oversized titles at the shared schema boundary', () => {
    expect(createNoteSchema.safeParse({ title: '  ' }).success).toBe(false);
    expect(createNoteSchema.safeParse({ title: 'x'.repeat(121) }).success).toBe(false);
  });
  it('rejects malformed notes before calling PostgreSQL', async () => {
    const response = await request(app).post('/api/v1/notes').send({ title: '' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe.skipIf(!process.env.TEST_DATABASE_URL)('notes CRUD against disposable PostgreSQL', () => {
  const app = createApp();
  afterAll(async () => { await closeDatabase(); });

  it('creates, reads, completes and deletes notes over HTTP', async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    const created = await request(app).post('/api/v1/notes').send({ title: 'My first real feature' });
    expect(created.status).toBe(201);
    const note = noteSchema.parse(created.body);
    expect(note.completed).toBe(false);

    const listed = await request(app).get('/api/v1/notes');
    expect(listed.status).toBe(200);
    expect(noteListSchema.parse(listed.body)).toContainEqual(note);

    const updated = await request(app).patch('/api/v1/notes/' + note.id).send({ completed: true });
    expect(updated.status).toBe(200);
    expect(noteSchema.parse(updated.body).completed).toBe(true);

    const invalidUpdate = await request(app).patch('/api/v1/notes/' + note.id).send({ completed: 'yes' });
    expect(invalidUpdate.status).toBe(400);

    const removed = await request(app).delete('/api/v1/notes/' + note.id);
    expect(removed.status).toBe(204);
    const missing = await request(app).delete('/api/v1/notes/' + note.id);
    expect(missing.status).toBe(404);
  });
});
