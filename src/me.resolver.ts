import { Resolver, Query, Ctx } from "type-graphql";

import * as db from "./zapatos/src";
// import * as theSchema from "./zapatos/schema";
import { Roles } from "./user.type";

import pool from "./pg-pool-test";

import { User } from "./user.type";
import { MyContext } from "./typings";
import { AuthenticationError } from "apollo-server-express";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext): Promise<User | undefined> {
    // if we can't find a userId on the current session => undefined

    if (!context.req.session || !context.req.session.userId) {
      return undefined;
    }

    const user = await db.selectOne("user", { id: context.req.session?.userId }).run(pool);
    const rolesCache: Roles[] = [];

    // It's difficult to get enums into the database
    // properly so we create a cache, use a for-of loop to iterate
    //  and cast as we loop.
    if (user?.roles) {
      for (const theRole of user.roles) {
        rolesCache.push(theRole as Roles);
      }
    }

    if (user && user.id) {
      return {
        ...user,
        name: user.firstName + " " + user.lastName,
        roles: [...rolesCache],
        profileImageUri: user.profileImageUri ? user.profileImageUri : "",
      };
    } else {
      throw new AuthenticationError("Not authenticated");
    }
  }
}
