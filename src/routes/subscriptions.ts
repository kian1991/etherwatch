import { Hono } from 'hono';
import { z } from 'zod';
import {
  addresses,
  InsertSubscriptionSchema,
  subscriptions,
  subscriptionsToAddresses,
} from '../../db/schema';
import { db } from '../../db/client';
import { ETHAdressSchema } from '../schemas';
import { eq } from 'drizzle-orm';

// create router
export const subscriptionRouter = new Hono();

const SubscriptionPostSchema = InsertSubscriptionSchema.and(
  z.object({
    address: ETHAdressSchema,
    valueCondition: z.number().optional(), // for examle min. ETH
  })
);

subscriptionRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parseResult = SubscriptionPostSchema.safeParse(body);
    if (!parseResult.success) {
      // handle validation errors
      return c.json({ error: parseResult.error.flatten().fieldErrors }, 400);
    }

    // Valid data here
    const { email, address, valueCondition } = parseResult.data;

    // insertion logic
    let insertedSubToAdd;
    await db.transaction(async (tx) => {
      let subscription = await tx
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.email, email));

      if (subscription.length === 0) {
        subscription = await tx
          .insert(subscriptions)
          .values({ email })
          .returning();
      }

      const existingAddress = await tx
        .select()
        .from(addresses)
        .where(eq(addresses.address, address));

      if (existingAddress.length === 0) {
        await tx.insert(addresses).values({ address });
      }

      insertedSubToAdd = await tx.insert(subscriptionsToAddresses).values({
        subscription: subscription[0].id,
        address,
        valueCondition: valueCondition?.toString(),
      });
    });

    return c.json({ data: { ...insertedSubToAdd![0], email } }, 201); // Assertion bc it'd have thrown an error if it was already in db
  } catch (error) {
    console.error(error);

    if (error instanceof Error && 'code' in error && error.code === '23505') {
      return c.json(
        { error: 'Subscription/Address relation already exists' },
        409
      );
    }

    // handle syntax error
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON' }, 400);
    }
    // handle other errors
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
