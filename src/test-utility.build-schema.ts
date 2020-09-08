import { buildSchema, BuildSchemaOptions } from "type-graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";

import { redisHostAndPortOpts } from "./redis";
import { RecipeResolver } from "./recipe.resolver";
import { ChangePasswordFromContextUseridResolver } from "./user.change-password-from-context";
import { MeResolver } from "./me.resolver";
import { LoginResolver } from "./login.resolver";
import { ChangePasswordFromTokenResolver } from "./user.change-password-from-token";

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

const buildSchemaOpts: BuildSchemaOptions = {
  resolvers: [
    ChangePasswordFromTokenResolver,
    ChangePasswordFromContextUseridResolver,
    MeResolver,
    LoginResolver,
    RecipeResolver,
  ],
  validate: false,
  pubSub, // provide redis-based instance of PubSub
};

// Build the TypeGraphQL schema
export const schema = buildSchema(buildSchemaOpts)
  .then((data) => data)
  .catch((err) => console.error(err));
