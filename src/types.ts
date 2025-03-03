import { InsertSubscriptionSchema } from '../db/schema';
import { SubscriptionsModel } from './models/subscriptions';
import { ETHAdressSchema } from './schemas';
import { z } from 'zod';

export const SubscriptionPostSchema = InsertSubscriptionSchema.and(
  z.object({
    address: ETHAdressSchema,
    valueCondition: z.number().optional(), // for examle min. ETH
  })
);

export type SubscriptionPost = z.infer<typeof SubscriptionPostSchema>;

export type SubscriptionWithTransactions = Awaited<
  ReturnType<typeof SubscriptionsModel.findSubscriptionsWithTransactions>
>;
