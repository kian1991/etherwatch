import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ETHAdressSchema } from '../../src/schemas';
import { relations } from 'drizzle-orm';
import { subscriptions } from './subscriptions';
import { subscriptionsToAddresses } from './subscriptions_addresses';
import { transactions } from './transactions';

const addressesColumns = {
  address: text().primaryKey(),
  label: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(), // i.e. label change
};

// Drizzle
export const addresses = pgTable('addresses', addressesColumns);
export const addressRelations = relations(addresses, ({ many }) => ({
  subscriptionsToAddresses: many(subscriptionsToAddresses),
  transactions: many(transactions),
}));

// TS
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// Zod
export const InsertAddresseSchema = createInsertSchema(addresses, {
  address: ETHAdressSchema,
});

export const SelectAddresseSchema = createSelectSchema(addresses);
