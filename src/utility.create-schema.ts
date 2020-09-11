import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import "reflect-metadata";

import { MeResolver } from "./me.resolver";
import { LoginResolver } from "./user.login.resolver";
import { RegisterResolver } from "./user.register.resolver";
import { ChangePasswordFromTokenResolver } from "./user.change-password-from-token";
import { ChangePasswordFromContextUseridResolver } from "./user.change-password-from-context";
import { RecipeResolver } from "./recipe.resolver";
import Redis, { RedisOptions } from "ioredis";
import { redisHostAndPortOpts } from "./redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { AdminEditAnotherUser_sInfoResolver } from "./user.admin.edit-another-user_s-user-info";
import { customAuthorizationChecker } from "./utility.custom-authorization-checker";

const options: RedisOptions = {
  ...redisHostAndPortOpts,
  retryStrategy: (times) => Math.max(times * 100, 3000),
};

const pubSub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export const createSchema = (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: [
      AdminEditAnotherUser_sInfoResolver,
      ChangePasswordFromTokenResolver,
      ChangePasswordFromContextUseridResolver,
      MeResolver,
      LoginResolver,
      RecipeResolver,
      RegisterResolver,
    ],
    authChecker: customAuthorizationChecker,
    pubSub,
  });
