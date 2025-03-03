import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import {
  subscriptions,
  addresses,
  subscriptionsToAddresses,
  SubscriptionToAddress,
} from '../../db/schema';

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

  static async findSubscriptionsWithTransactions(email?: string) {
    // check for set mail. Drizzle ignores undefined where-clauses by default
    const whereCondition = email ? eq(subscriptions.email, email) : undefined;
    const subs = await db.query.subscriptions.findMany({
      where: whereCondition,
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
