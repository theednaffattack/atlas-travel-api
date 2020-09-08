import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { inspect } from "util";

import pool from "../src/pg-pool";
import testPool from "../src/pg-pool-test";
import * as db from "./zapatos/src";
import { User } from "./user.type";
import { MyContext } from "./typings";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./middleware.logger";
import { PasswordInput } from "./password.input";

@Resolver()
export class ChangePasswordFromContextUseridResolver {
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User, { nullable: true })
  async changePasswordFromContextUserid(
    @Arg("data") { password }: PasswordInput,
    @Ctx() { req, userId }: MyContext,
  ): Promise<User | null> {
    if (!userId) {
      return null;
    }
    let user;
    try {
      if (process.env.NODE_ENV === "test") {
        user = await db.selectOne("user", { id: userId }).run(testPool);
      } else {
        user = await db.selectOne("user", { id: userId }).run(pool);
      }

      // can't find a user in the db
      if (!user) {
        return null;
      }

      // security
      const newHashedPassword = await bcrypt.hash(password, 12);

      // save updated password
      const [updatedUser] = await db.update("user", { password: newHashedPassword }, { id: userId }).run(pool);

      console.log("\nOBI WAN KNEW THIS TO BE TRUE\n\n UPDATED USER\n", updatedUser);

      // login in the user
      req.session!.userId = user.id;

      delete user.password;

      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        profileImageUri: user.profileImageUri ? user.profileImageUri : "",
      };
    } catch (error) {
      console.log("User lookup ERRROR\n", inspect(error));
    }

    return null;
  }
}
