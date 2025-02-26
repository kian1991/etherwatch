// email, subscriptionId, createdAt, updatedAt
import { relations } from 'drizzle-orm';
import { pgTable, boolean, text, serial, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptions } from './subscriptions';

const emailsColumns = {
  id: uuid().primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
};

// Drizzle
export const emails = pgTable('emails', emailsColumns);

// Relations
export const emailRelations = relations(emails, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

// TS
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;

// Zod
export const insertEmailSchema = createInsertSchema(emails, {
  email: (val) => val.email(),
});
export const selectEmailSchema = createSelectSchema(emails);
