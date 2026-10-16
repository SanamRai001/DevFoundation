import type { Express, Response } from 'express';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { createNoteSchema, noteListSchema, noteSchema, updateNoteSchema } from '@devfoundation/contracts';
import { getDatabase } from './client.js';
import { notes } from './schema.js';

const idSchema = z.coerce.number().int().positive();

function reject(res: Response, message = 'Invalid note data.') {
  res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
}
function unavailable(res: Response) {
  res.status(503).json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'Unable to access notes.' } });
}

// These are intentionally small teaching endpoints. No user accounts or multi-tenant isolation.
export function registerNotesRoutes(app: Express) {
  app.get('/api/v1/notes', async (_req, res) => {
    try {
      const rows = await getDatabase().select().from(notes).orderBy(desc(notes.id));
      res.json(noteListSchema.parse(rows));
    } catch {
      unavailable(res);
    }
  });

  app.post('/api/v1/notes', async (req, res) => {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) return reject(res, 'Title must contain 1–120 characters.');
    try {
      const [created] = await getDatabase().insert(notes).values(parsed.data).returning();
      res.status(201).json(noteSchema.parse(created));
    } catch {
      unavailable(res);
    }
  });

  app.patch('/api/v1/notes/:id', async (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    const body = updateNoteSchema.safeParse(req.body);
    if (!id.success || !body.success) return reject(res);
    try {
      const [updated] = await getDatabase().update(notes).set(body.data).where(eq(notes.id, id.data)).returning();
      if (!updated) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found.' } });
      res.json(noteSchema.parse(updated));
    } catch {
      unavailable(res);
    }
  });

  app.delete('/api/v1/notes/:id', async (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    if (!id.success) return reject(res);
    try {
      const [deleted] = await getDatabase().delete(notes).where(eq(notes.id, id.data)).returning({ id: notes.id });
      if (!deleted) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found.' } });
      res.status(204).end();
    } catch {
      unavailable(res);
    }
  });
}
