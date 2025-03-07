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
import { withErrorHandler } from './error-handler';

// create router
export const subscriptionRouter = new Hono();

subscriptionRouter.post(
  '/',
  withErrorHandler(async (c) => {
    const body = await c.req.json();

    // Error will be thrown if invalid and handled by error handler
    const parseResult = SubscriptionPostSchema.parse(body);

    // Valid data here
    const { email, address, valueCondition } = parseResult;

    // Insert subscription
    const subscription =
      await SubscriptionsModel.findOrCreateSubscription(email);

    // Insert address
    const insertedAddress =
      await SubscriptionsModel.findOrCreateAddress(address);

    // Insert subscription to address
    const insertedSubToAdd =
      await SubscriptionsModel.insertSubscriptionToAddress(
        subscription.id,
        insertedAddress.address,
        valueCondition
      );

    return c.json({ data: { ...insertedSubToAdd, email } }, 201); // Assertion bc it'd have thrown an error if it was already in db
  })
);
