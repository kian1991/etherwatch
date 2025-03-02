import { relations } from 'drizzle-orm';
import { pgTable, timestamp, text, uuid, numeric } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ETHAdressSchema } from '../../src/schemas';
import { addresses } from './addresses';

const transactionsColumns = {
  hash: text().notNull().primaryKey(),
  relatedAddress: text('related_address')
    .notNull()
    .references(() => addresses.address, { onDelete: 'cascade' }),
  from: text().notNull(),
  to: text().notNull(),
  value: text().notNull(), // text here because we don't need to do any arithmetic on this value
};

// Drizzle Schema
export const transactions = pgTable('transactions', transactionsColumns);

// Relations
export const transactionRelations = relations(transactions, ({ one }) => ({
  relatedAddress: one(addresses, {
    fields: [transactions.relatedAddress],
    references: [addresses.address],
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
