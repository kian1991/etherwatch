import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ETHAdressSchema } from '../../src/schemas';

const addressesColumns = {
  address: text().primaryKey().unique(),
  label: text(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // i.e. label change
};

// Drizzle
export const addresses = pgTable('addresses', addressesColumns);

// TS
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// Zod
export const InsertAddresseSchema = createInsertSchema(addresses, {
  address: ETHAdressSchema,
});

export const SelectAddresseSchema = createSelectSchema(addresses);
