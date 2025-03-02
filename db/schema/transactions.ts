import { relations } from 'drizzle-orm';
import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptions } from './subscriptions';
import { ETHAdressSchema } from '../../src/schemas';
import { hash } from 'bun';

const transactionsColumns = {
  id: uuid().primaryKey().defaultRandom(),
  hash: text().notNull(),
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  from: text().notNull(),
  to: text().notNull(),
  value: text().notNull(), // text here because we don't need to do any arithmetic on this value
  timestamp: timestamp(),
};

// Drizzle Schema
export const transactions = pgTable('transactions', transactionsColumns);

// Relations
export const transactionRelations = relations(transactions, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [transactions.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// TypeScript Types
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// Zod Schemata
export const InsertTransactionSchema = createInsertSchema(transactions, {
  // custom validation
  to: ETHAdressSchema,
  from: ETHAdressSchema,
});
export const SelectTransactionSchema = createSelectSchema(transactions);
