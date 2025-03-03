import { relations } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  boolean,
  uuid,
  text,
  primaryKey,
  numeric,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptions } from './subscriptions';
import { addresses } from './addresses';

const subscriptionsToAddressesColumns = {
  subscription: uuid('subscription')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  address: text('address_id')
    .notNull()
    .references(() => addresses.address, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  valueCondition: numeric('value_condition'),
  isActive: boolean('is_active').notNull().default(true),
};

// Drizzle
export const subscriptionsToAddresses = pgTable(
  'subscriptions_to_addresses',
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
export type SubscriptionToAddress =
  typeof subscriptionsToAddresses.$inferSelect;
export type NewSubscriptionToAddress =
  typeof subscriptionsToAddresses.$inferInsert;

// Zod
export const InsertSubscriptionToAddressSchema = createInsertSchema(
  subscriptionsToAddresses
);

export const SelectSubscriptionToAddressSchema = createSelectSchema(
  subscriptionsToAddresses
);
