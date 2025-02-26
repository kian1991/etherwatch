import { db } from '../../db/client';
import { subscriptions, transactions } from '../../db/schema';
import { eq } from 'drizzle-orm';

// todo: give this function some love
export async function getSubscriptionsWithTransactions() {
  const rawResults = await db
    .select({
      subscriptionId: subscriptions.id,
      address: subscriptions.address,
      transactionId: transactions.id,
      from: transactions.from,
      to: transactions.to,
      value: transactions.value,
      timestamp: transactions.timestamp,
    })
    .from(subscriptions)
    .leftJoin(transactions, eq(subscriptions.address, transactions.to))
    .where(eq(subscriptions.isActive, true));

  const subscriptionsMap = new Map();

  rawResults.forEach((row) => {
    if (!subscriptionsMap.has(row.subscriptionId)) {
      subscriptionsMap.set(row.subscriptionId, {
        subscriptionId: row.subscriptionId,
        address: row.address,
        transactions: [],
      });
    }

    if (row.transactionId) {
      subscriptionsMap.get(row.subscriptionId).transactions.push({
        id: row.transactionId,
        from: row.from,
        to: row.to,
        value: row.value,
        timestamp: row.timestamp,
      });
    }
  });

  return Array.from(subscriptionsMap.values());
}
