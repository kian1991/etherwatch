CREATE TABLE "addresses" (
	"address" text PRIMARY KEY NOT NULL,
	"label" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "addresses_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" text NOT NULL,
	"subscription_id" uuid NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"value" text NOT NULL,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "subscriptionsToAddresses" (
	"subscription" uuid NOT NULL,
	"address_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "subscriptionsToAddresses_subscription_address_id_pk" PRIMARY KEY("subscription","address_id"),
	CONSTRAINT "subscriptionsToAddresses_subscription_unique" UNIQUE("subscription"),
	CONSTRAINT "subscriptionsToAddresses_address_id_unique" UNIQUE("address_id")
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptionsToAddresses" ADD CONSTRAINT "subscriptionsToAddresses_subscription_subscriptions_id_fk" FOREIGN KEY ("subscription") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptionsToAddresses" ADD CONSTRAINT "subscriptionsToAddresses_address_id_addresses_address_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("address") ON DELETE cascade ON UPDATE no action;