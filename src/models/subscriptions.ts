import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import {
  subscriptions,
  addresses,
  subscriptionsToAddresses,
  Address,
  SubscriptionToAddress,
} from '../../db/schema';
import { QueryResult } from 'pg';

export class SubscriptionsModel {
  static async findOrCreateSubscription(email: string) {
    return await db.transaction(async (tx) => {
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
      return subscription[0];
    });
  }

  static async findOrCreateAddress(address: string) {
    return await db.transaction(async (tx) => {
      let existingAddress = await tx
        .select()
        .from(addresses)
        .where(eq(addresses.address, address));

      if (existingAddress.length === 0) {
        existingAddress = await tx
          .insert(addresses)
          .values({ address })
          .returning();
      }

      return existingAddress[0];
    });
  }

  static async insertSubscriptionToAddress(
    subscriptionId: string,
    address: string,
    valueCondition?: number
  ): Promise<SubscriptionToAddress> {
    const result = await db
      .insert(subscriptionsToAddresses)
      .values({
        subscription: subscriptionId,
        address,
        valueCondition: valueCondition?.toString(),
      })
      .returning();
    return result[0];
  }

  static async findAllSubscriptionsWithTransactions() {
    const subs = await db.query.subscriptions.findMany({
      with: {
        subscriptionsToAddresses: {
          columns: {
            address: true,
            isActive: true,
            valueCondition: true,
          },
          with: {
            address: {
              with: {
                transactions: true,
              },
            },
          },
        },
      },
    });
    return subs;
  }
}
