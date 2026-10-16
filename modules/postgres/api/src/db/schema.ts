import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

// Example schema only. Replace this table with real domain entities.
export const sampleNotes = pgTable('sample_notes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 120 }).notNull(),
});
