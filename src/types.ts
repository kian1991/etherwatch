import { InsertSubscriptionSchema } from '../db/schema';
import { ETHAdressSchema } from './schemas';
import { z } from 'zod';

export const SubscriptionPostSchema = InsertSubscriptionSchema.and(
  z.object({
    address: ETHAdressSchema,
    valueCondition: z.number().optional(), // for examle min. ETH
  })
);

export type SubscriptionPost = z.infer<typeof SubscriptionPostSchema>;
