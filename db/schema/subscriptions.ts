import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { subscriptionsToAddresses } from './subscriptions_addresses';

const subscriptionsColumns = {
  id: uuid().primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
};

// Drizzle
export const subscriptions = pgTable('subscriptions', subscriptionsColumns);

export const subscriptionRelations = relations(subscriptions, ({ many }) => ({
  subscriptionsToAddresses: many(subscriptionsToAddresses),
}));

// TS
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

// Zod
export const InsertSubscriptionSchema = createInsertSchema(subscriptions, {
  email: (val) => val.email(),
});

export const SelectSubscriptionSchema = createSelectSchema(subscriptions);
