ALTER TABLE "subscriptionsToAddresses" RENAME TO "subscriptions_to_addresses";--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" DROP CONSTRAINT "subscriptionsToAddresses_subscription_subscriptions_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" DROP CONSTRAINT "subscriptionsToAddresses_address_id_addresses_address_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" DROP CONSTRAINT "subscriptionsToAddresses_subscription_address_id_pk";--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" ADD CONSTRAINT "subscriptions_to_addresses_subscription_address_id_pk" PRIMARY KEY("subscription","address_id");--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" ADD CONSTRAINT "subscriptions_to_addresses_subscription_subscriptions_id_fk" FOREIGN KEY ("subscription") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions_to_addresses" ADD CONSTRAINT "subscriptions_to_addresses_address_id_addresses_address_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("address") ON DELETE cascade ON UPDATE no action;