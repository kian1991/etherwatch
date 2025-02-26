# ETHWATCH Backend with bun and hono


## Setup

Run the Database:
```sh
docker-compose up -d
```

Install dependencies:
```sh
bun install
```

Generate and run the migrations:
```sh
bun run db:generate
bun run db:migrate
```

And start the dev server:
```sh
bun run dev
```



## Usage

To subscribe to ETH Address:
```
POST localhost:3000/subscriptions
{
    "email": "kianluetke@gmail.com",
    "address": "<ETH_ADDRESS>"
}
```

Watch the logs to see the updates :) new Addresses will be automatically added to the watchlist in 1 Minute intervals by the `watcher` service.


To check a summary of current tracked txs open the browser and navigate to:

[http://localhost:3000/summary](http://localhost:3000/summary)


> This is how the a quick draw for the email. The email service is not implemented yet.

