import { BlockTag, ethers, Provider } from 'ethers';
import { db } from '../../db/client';
import {
  Address,
  addresses,
  subscriptions,
  subscriptionsToAddresses,
  Transaction,
  transactions,
} from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { ALCHEMY_WS_URL } from '../constants';

const provider = new ethers.WebSocketProvider(ALCHEMY_WS_URL);
const TIME_BETWEEN_CHECKS = 1000 * 60 * 1; // 1 minute

let watchedAddresses: Map<string, Address>;

async function loadwatchedSubscriptions() {
  const addr = await db.select().from(addresses);

  if (!addr) return; // no addresses to watch

  console.log(`Currently watching ${addr.length} addresses`);

  watchedAddresses = new Map(addr.map((a) => [a.address.toLowerCase(), a]));
}

export async function startWatching() {
  await loadwatchedSubscriptions();

  if (!watchedAddresses) {
    console.log('No addresses to watch...Retrying in 1 minute');
    setInterval(loadwatchedSubscriptions, TIME_BETWEEN_CHECKS);
    return;
  }

  // clear all pending listeners
  await provider.removeAllListeners('pending');

  try {
    provider.on('pending', async (hash) => {
      const txData = await provider.getTransaction(hash);
      process.stdout.write('.');
      if (!txData?.to && !txData?.from) {
        console.log('\nTransaction missing to or from field');
        return;
      }

      const beaver =
        '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' === txData.to ||
        '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' === txData.from;

      if (beaver) console.log('Beaver spotted!');
      // check if the transaction is related to a watched address
      const match =
        watchedAddresses.get(txData.to!.toLowerCase()) ||
        watchedAddresses.get(txData.from.toLowerCase());

      if (!match) return;

      console.log(
        `\nTransaction ${hash} is related to the address ${match.address} saving...`
      );

      const subscription = await db
        .select()
        .from(subscriptions)
        .leftJoin(
          subscriptionsToAddresses,
          and(eq(subscriptionsToAddresses.subscription, subscriptions.id))
        )
        .where(eq(subscriptionsToAddresses.address, match.address));

      if (!subscription) {
        console.log('Subscription not found');
        return;
      }

      const transaction: Transaction = {
        hash: txData.hash,
        from: txData.from,
        to: txData.to || '',
        value: txData.value.toString(),
        relatedAddress: match.address,
      };

      await db.insert(transactions).values(transaction).returning();
      console.log('Transaction saved: ', transaction);
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      console.log('Transaction already saved. Skipping...');
      return;
    }

    console.error('Error saving transaction', error);
  }

  setInterval(loadwatchedSubscriptions, TIME_BETWEEN_CHECKS);
}
