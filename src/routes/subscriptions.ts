import { Hono } from 'hono';
import { z } from 'zod';
import {
  emails,
  insertEmailSchema,
  insertSubscriptionSchema,
  subscriptions,
} from '../../db/schema';
import { db } from '../../db/client';
import { ETHAdressSchema } from '../schemas';
import { eq } from 'drizzle-orm';

// create router
export const subscriptionRouter = new Hono();

const subscriptionPostSchema = insertEmailSchema.and(
  z.object({
    address: ETHAdressSchema,
  })
);

subscriptionRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parseResult = subscriptionPostSchema.safeParse(body);
    if (!parseResult.success) {
      // handle validation errors
      return c.json({ error: parseResult.error.flatten().fieldErrors }, 400);
    }

    // Valid data here
    const { email, address } = parseResult.data;

    // Todo: Transaction here 🤡
    const [existingEmail] = await db
      .select({ id: emails.id })
      .from(emails)
      .where(eq(emails.email, email));

    let emailId = existingEmail?.id;

    if (!existingEmail) {
      let [insertedEmail] = await db
        .insert(emails)
        .values({ email })
        .returning({ id: emails.id });
      emailId = insertedEmail.id;
    }

    // Insert the subscription only if it does not already exist
    const [insertedSubscription] = await db
      .insert(subscriptions)
      .values({ emailId, address })
      .onConflictDoNothing()
      .returning({
        id: subscriptions.id,
        address: subscriptions.address,
      });

    return c.json({ data: { ...insertedSubscription, email } }, 201);
  } catch (error) {
    console.error(error);
    // handle syntax error
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON' }, 400);
    }
    // handle other errors
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
