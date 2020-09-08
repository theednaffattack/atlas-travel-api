import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import "reflect-metadata";

import { MeResolver } from "./me.resolver";
import { LoginResolver } from "./login.resolver";
import { RegisterResolver } from "./register.resolver";
import { ChangePasswordFromTokenResolver } from "./user.change-password-from-token";
import { ChangePasswordFromContextUseridResolver } from "./user.change-password-from-context";
import { RecipeResolver } from "./recipe.resolver";
import Redis, { RedisOptions } from "ioredis";
import { redisHostAndPortOpts } from "./redis";
import { RedisPubSub } from "graphql-redis-subscriptions";

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

export const createSchema = (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: [
      ChangePasswordFromTokenResolver,
      ChangePasswordFromContextUseridResolver,
      MeResolver,
      LoginResolver,
      RecipeResolver,
      RegisterResolver,
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },

    pubSub, // provide redis-based instance of PubSub
  });
