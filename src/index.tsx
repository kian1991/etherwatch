import { Hono } from 'hono';
import { subscriptionRouter } from './routes/subscriptions';
import { startWatching } from './services/watcher';
import { getSubscriptionsWithTransactions } from './services/mailer';
import { SummaryEmail } from './emails/summary';

const app = new Hono();

// Connecting Routes
app.route('/subscriptions', subscriptionRouter);

app.get('/', (c) => {
  return c.text('Welcome to ETHWATCH 🦭');
});

app.get('/summary', async (c) => {
  const subs = await getSubscriptionsWithTransactions();
  return c.html(<SummaryEmail data={subs} />);
});

// start the watcher
startWatching()
  .catch(console.error)
  .then(() => {
    console.log('Watcher started');
  });

export default app;
