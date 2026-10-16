import type { Express, Response } from 'express';
import { z } from 'zod';
import {
  createNoteSchema, updateNoteSchema, noteSchema, noteListSchema, type Note,
} from '@devfoundation/contracts';

const idSchema = z.coerce.number().int().positive();
function invalid(res: Response, message = 'Invalid note data.') {
  return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
}
function missing(res: Response) {
  return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found.' } });
}

// Educational storage only: per Express app, never persisted, not multi-user safe.
export function registerNotesRoutes(app: Express) {
  let nextId = 1;
  let notes: Note[] = [];

  app.get('/api/v1/notes', (_req, res) => {
    res.json(noteListSchema.parse([...notes].reverse()));
  });

  app.post('/api/v1/notes', (req, res) => {
    const data = createNoteSchema.safeParse(req.body);
    if (!data.success) return invalid(res, 'Title must contain 1–120 characters.');
    const note = noteSchema.parse({ id: nextId++, title: data.data.title, completed: false });
    notes.push(note);
    res.status(201).json(note);
  });

  app.patch('/api/v1/notes/:id', (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    const body = updateNoteSchema.safeParse(req.body);
    if (!id.success || !body.success) return invalid(res);
    const index = notes.findIndex((note) => note.id === id.data);
    if (index < 0) return missing(res);
    const updated = noteSchema.parse({ ...notes[index]!, completed: body.data.completed });
    notes[index] = updated;
    res.json(updated);
  });

  app.delete('/api/v1/notes/:id', (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    if (!id.success) return invalid(res);
    const index = notes.findIndex((note) => note.id === id.data);
    if (index < 0) return missing(res);
    notes.splice(index, 1);
    res.status(204).end();
  });
}
