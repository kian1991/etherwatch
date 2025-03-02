import { relations } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  boolean,
  uuid,
  text,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptions } from './subscriptions';
import { addresses } from './addresses';

const subscriptionsToAddressesColumns = {
  subscription: uuid('subscription')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' })
    .unique(),
  address: text('address_id')
    .notNull()
    .references(() => addresses.address, { onDelete: 'cascade' })
    .unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
};

// Drizzle
export const subscriptionsToAddresses = pgTable(
  'subscriptionsToAddresses',
  subscriptionsToAddressesColumns,
  (table) => [primaryKey({ columns: [table.subscription, table.address] })]
);

// Relations
export const subscriptionToAddressesRelations = relations(
  subscriptionsToAddresses,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionsToAddresses.subscription],
      references: [subscriptions.id],
    }),
    address: one(addresses, {
      fields: [subscriptionsToAddresses.address],
      references: [addresses.address],
    }),
  })
);

// TS
export type SubscriptionToAddress = typeof subscriptions.$inferSelect;
export type NewSubscriptionToAddress = typeof subscriptions.$inferInsert;

// Zod
export const InsertSubscriptionToAddressSchema =
  createInsertSchema(subscriptions);

export const SelectSubscriptionToAddressSchema =
  createSelectSchema(subscriptions);
