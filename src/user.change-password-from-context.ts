import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { inspect } from "util";

import * as db from "./zapatos/src";
import { User } from "./user.type";
import { MyContext } from "./typings";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./middleware.logger";
import { PasswordInput } from "./password.input";
import { getConnectionPool } from "./utility.get-connection-pool";

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
    const pool = getConnectionPool(process.env.NODE_ENV);
    try {
      const user = await db.selectOne("user", { id: userId }).run(pool);

      // can't find a user in the db
      if (!user) {
        return null;
      }

      // security
      const newHashedPassword = await bcrypt.hash(password, 12);

      // save updated password
      const [updatedUser] = await db.update("user", { password: newHashedPassword }, { id: userId }).run(pool);

      // login in the user
      req.session!.userId = user.id;

      delete user.password;

      return {
        ...updatedUser,
        name: `${user.firstName} ${user.lastName}`,
        profileImageUri: user.profileImageUri ? user.profileImageUri : "",
      };
    } catch (error) {
      console.log("User lookup ERRROR\n", inspect(error));
    }

    return null;
  }
}
