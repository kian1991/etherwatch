import { ethers } from 'ethers';
import { db } from '../../db/client';
import { subscriptions, transactions } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { ALCHEMY_WS_URL } from '../constants';

const provider = new ethers.WebSocketProvider(ALCHEMY_WS_URL);

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
  await loadwatchedSubscriptions(); // Load watched addresses on startup

  provider.on('pending', async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      // console.log('Pending transaction:', tx?.to, tx?.from);
      if (
        tx &&
        tx.to &&
        tx.from &&
        (watchedSubscriptions.has(tx.to) || watchedSubscriptions.has(tx.from))
      ) {
        console.log(`Transaction detected: ${txHash}`);

        const id =
          watchedSubscriptions.get(tx.to) || watchedSubscriptions.get(tx.from);

        await db.insert(transactions).values({
          subscriptionId: id as string, // Assertion bc we know it exists from the if condition
          id: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  });

  // Load watched addresses every minute
  setInterval(loadwatchedSubscriptions, 1 * 60 * 1000);
}
