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
import { SubscriptionPostSchema } from '../types';
import { SubscriptionsModel } from '../models/subscriptions';

// create router
export const subscriptionRouter = new Hono();

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

    // Insert subscription
    const subscription = await SubscriptionsModel.findOrCreateSubscription(
      email
    );

    // Insert address
    const insertedAddress = await SubscriptionsModel.findOrCreateAddress(
      address
    );

    // Insert subscription to address
    const insertedSubToAdd =
      await SubscriptionsModel.insertSubscriptionToAddress(
        subscription.id,
        insertedAddress.address,
        valueCondition
      );

    return c.json({ data: { ...insertedSubToAdd, email } }, 201); // Assertion bc it'd have thrown an error if it was already in db
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
