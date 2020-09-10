import { Arg, Resolver, Mutation, UseMiddleware, Ctx } from "type-graphql";
import { Pool } from "pg";

import * as db from "./zapatos/src";
import { EditUserInput } from "./user.edit-user-info.input";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./middleware.logger";
import { MyContext } from "./typings";
import { User } from "./user.type";
import { getConnectionPool } from "./utility.get-connection-pool";
import { errorSavingInfoToDatabase } from "./utility.errors";

@Resolver()
export class EditMyOwnUserInfoResolver {
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User)
  async adminEditUserInfo(
    @Arg("data") { email, firstName, lastName }: EditUserInput,
    @Ctx() ctx: MyContext,
  ): Promise<Partial<User>> {
    const pool: Pool = getConnectionPool(process.env.NODE_ENV as string);

    const setBasicInfoObject = {
      email,
      firstName,
      lastName,
    };

    try {
      const [updatedUser] = await db.update("user", setBasicInfoObject, { id: ctx.userId }).run(pool);

      if (updatedUser) {
        return {
          ...updatedUser,
          name: updatedUser.firstName + " " + updatedUser.lastName,
          profileImageUri: updatedUser.profileImageUri ? updatedUser.profileImageUri : "",
        };
      }
      // If we could not update the user throw an error.
      throw Error(`${errorSavingInfoToDatabase("adminEditUserInfo")}`);
    } catch (error) {
      throw Error(`${error} :: ${errorSavingInfoToDatabase("adminEditUserInfo")}`);
    }
  }
}
