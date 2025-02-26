import { relations } from 'drizzle-orm';
import { pgTable, timestamp, boolean, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { emails } from './emails';
import { ETHAdressSchema } from '../../src/schemas';
import { transactions } from './transactions';

const subscriptionsColumns = {
  id: uuid().primaryKey().defaultRandom(),
  emailId: uuid('email_id')
    .notNull()
    .references(() => emails.id, { onDelete: 'cascade' }),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
};

// Drizzle
export const subscriptions = pgTable('subscriptions', subscriptionsColumns);

// Relations
export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  email: one(emails, {
    fields: [subscriptions.emailId],
    references: [emails.id],
  }),
}));

// TS
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

// Zod
export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  address: ETHAdressSchema,
});

export const selectSubscriptionSchema = createSelectSchema(subscriptions);
