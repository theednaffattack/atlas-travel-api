import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import * as db from "./zapatos/src";

import pool from "./pg-pool";
import { redis } from "./redis";
import { User, Roles } from "./user.type";
import { forgotPasswordPrefix } from "./constants";
import { MyContext } from "./typings";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./middleware.logger";
import { ChangePasswordInput } from "./user.change-password.input";

// prettier-ignore
@Resolver()
export class ChangePasswordFromTokenResolver {
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User, { nullable: true })
  async changePasswordFromToken(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    

    // token expired in redis, possibly bad token
    if (!userId) {
      return null;
    }
    let user;

try {
  
  user = await db.selectExactlyOne("user", {id: ctx.userId}).run(pool);
} catch (error) {
  if (error instanceof db.NotExactlyOneError) console.log(`${error.name}: ${error.message}`);
  // else throw err;
  else throw new Error(error);
}

    // const user = await User.findOne(userId);

    // can't find a user in the db
    if (!user) {
      return null;
    }

    // don't allow this token to be used to change
    // password again
    await redis.del(forgotPasswordPrefix + token);

      // security
      const newHashedPassword = await bcrypt.hash(password, 12);

      // save updated password
      const updatedUser = await db.update("user", { password: newHashedPassword },  { id: userId }).run(pool);

console.log("\nMANUAL TEST\nVIEW UPDATED", updatedUser)
      

    // login in the user
    ctx.req.session!.userId = user.id;

    

    const rolesCache: Roles[] = [];

    // It's difficult to get enums into the database
    // properly so we create a cache, use a for-of loop to iterate
    //  and cast as we loop.
    if (user?.roles) {
      for (const theRole of user.roles) {
        rolesCache.push(theRole as Roles);
      }
    }

    return {...user, roles: [...rolesCache], name: user.firstName + " " + user.lastName, profileImageUri: user.profileImageUri ? user.profileImageUri : "'"};
  }
}
