import { Hono } from 'hono';
import { subscriptionRouter } from './routes/subscriptions';
import { startWatching } from './services/watcher';
import { Summary } from './emails/summary';
import { SubscriptionsModel } from './models/subscriptions';

const app = new Hono();

// Connecting Routes
app.route('/subscriptions', subscriptionRouter);

app.get('/', (c) => {
  return c.text('Welcome to ETHWATCH 🦭');
});

app.get('/summary', async (c) => {
  const subs = await SubscriptionsModel.findSubscriptionsWithTransactions();

  return c.html(<Summary data={subs} />);
});

// start the watcher
// startWatching().catch(console.error);

export default app;
