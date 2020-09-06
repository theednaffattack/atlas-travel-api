import { buildSchema } from "type-graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";

import Redis, { RedisOptions } from "ioredis";
import { redisHostAndPortOpts } from "./redis";
import { RecipeResolver } from "./recipe.resolver";

// configure Redis connection options
const options: RedisOptions = {
  ...redisHostAndPortOpts,
  retryStrategy: (times) => Math.max(times * 100, 3000),
};

// create Redis-based pub-sub
const pubSub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

// Build the TypeGraphQL schema
export const schema = buildSchema({
  resolvers: [RecipeResolver],
  validate: false,
  pubSub, // provide redis-based instance of PubSub
})
  .then((data) => data)
  .catch((err) => console.error(err));
