import { ethers } from 'ethers';

export async function fetchTransactionWithRetry(
  provider: ethers.WebSocketProvider,
  txHash: string,
  retries = 3,
  delay = 500
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx) return tx;
    } catch (error: any) {
      if (error.code === 429) {
        console.warn(
          `Rate limit hit. Retrying in ${delay}ms... (Attempt ${
            attempt + 1
          }/${retries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error('error:', error);
        break;
      }
    }
  }
  console.error(`Failed to fetch transaction: ${txHash}`);
  return null;
}
