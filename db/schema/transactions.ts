import { relations } from 'drizzle-orm';
import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptions } from './subscriptions';
import { ETHAdressSchema } from '../../src/schemas';

const transactionsColumns = {
  id: text('id').primaryKey(), // We use the transaction hash as the primary key
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  from: text('from').notNull(),
  to: text('to').notNull(),
  value: text('value').notNull(), // text here because we don't need to do any arithmetic on this value
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
export const insertTransactionSchema = createInsertSchema(transactions, {
  // custom validation
  to: ETHAdressSchema,
  from: ETHAdressSchema,
});
export const selectTransactionSchema = createSelectSchema(transactions);
