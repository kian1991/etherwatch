import { BlockTag, ethers, Provider } from 'ethers';
import { db } from '../../db/client';
import { subscriptions, transactions } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { ALCHEMY_WS_URL } from '../constants';

const provider = new ethers.WebSocketProvider(ALCHEMY_WS_URL);

// provider.on('connect', () => {
//   console.log('Connected to Alchemy');
// });

// provider.on('error', (error) => {
//   console.error('Error', error);
// });

let watchedSubscriptions = new Map<string, string>();

async function loadwatchedSubscriptions() {
  const addresses = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.isActive, true));

  watchedSubscriptions.clear();

  addresses.forEach(({ id, address }) => {
    watchedSubscriptions.set(address, id);
  });

  console.log(`Currently watching ${watchedSubscriptions.size} addresses`);
}

export async function startWatching() {
  await loadwatchedSubscriptions();

  provider.on('block', async (blockNumber: BlockTag) => {
    console.log(`New block: ${blockNumber.toString()}`);

    const block = await provider.getBlock(blockNumber);

    if (!block) {
      console.log('Block not found, skipping');
      return;
    }

    for (const hash of block.transactions) {
      const tx = await provider.getTransaction(hash);
      if (!tx) continue; // Skip if transaction not found
      if (tx.to && watchedSubscriptions.has(tx.to)) {
        const id = watchedSubscriptions.get(tx.to);
        if (!id) continue; // Skip if subscription not found
        const existingTx = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.id, tx.hash),
              eq(transactions.subscriptionId, id)
            )
          );
        if (existingTx.length > 0) continue; // transaction already exists
        await db
          .insert()
          .into(transactions)
          .values({
            id: tx.hash,
            subscriptionId: id,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
            timestamp: new Date(block.timestamp * 1000),
          });
        console.log(`New transaction detected: ${tx.hash}`);
      }
    }
  });

  setInterval(loadwatchedSubscriptions, 1000 * 60 * 1); // 1 minute
}
