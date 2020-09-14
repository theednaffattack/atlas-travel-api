import { Arg, Resolver, Mutation, UseMiddleware, Ctx, Authorized } from "type-graphql";
import { Pool } from "pg";

import * as db from "./zapatos/src";
import { AdminEditUserInput } from "./user.edit-user-info.input";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./middleware.logger";
import { MyContext } from "./typings";
import { User, Roles } from "./user.type";
import { getConnectionPool } from "./utility.get-connection-pool";
import { errorSavingInfoToDatabase } from "./utility.errors";

@Resolver()
export class AdminEditAnotherUser_sInfoResolver {
  @UseMiddleware(isAuth, logger)
  @Authorized("administrator")
  @Mutation(() => User)
  async adminEditAnotherUser_sInfo(
    @Arg("data") { email, firstName, lastName, userIdToBeChanged }: AdminEditUserInput,
    @Ctx() ctx: MyContext,
  ): Promise<Partial<User>> {
    const pool: Pool = getConnectionPool(process.env.NODE_ENV as string);

    try {
      const adminUser = await db.select("user", { id: ctx.userId }).run(pool);
      if (!adminUser) {
        throw Error("Error validating admin user.");
      }
    } catch (error) {}

    const setBasicInfoObject = {
      email,
      firstName,
      lastName,
    };

    try {
      const [updatedUser] = await db.update("user", setBasicInfoObject, { id: userIdToBeChanged }).run(pool);

      const rolesCache: Roles[] = [];

      // It's difficult to get enums into the database
      // properly so we create a cache, use a for-of loop to iterate
      //  and cast as we loop.
      if (updatedUser?.roles) {
        for (const theRole of updatedUser.roles) {
          rolesCache.push(theRole as Roles);
        }
      }
      if (updatedUser) {
        return {
          ...updatedUser,
          name: updatedUser.firstName + " " + updatedUser.lastName,
          roles: [...rolesCache],
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
