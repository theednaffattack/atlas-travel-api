import { Resolver, Ctx, Arg, Mutation } from "type-graphql";
import bcrypt from "bcryptjs";
// import { AuthenticationError } from "apollo-server-express";

import * as db from "./zapatos/src";
import pool from "./pg-pool";

import { User, Roles } from "./user.type";
import { MyContext } from "./typings";
import { LoginInput } from "./login.input";
import { errorSavingInfoToDatabase } from "./utility.errors";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(@Arg("data") { email, password }: LoginInput, @Ctx() context: MyContext): Promise<User | null> {
    let user;

    try {
      user = await db.selectOne("user", { email }).run(pool);
    } catch (error) {
      errorSavingInfoToDatabase("login", error);
    }

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    // if the supplied password is invalid return early
    if (!valid) {
      return null;
    }

    // if the user has not confirmed via email
    if (!user.confirmed) {
      throw new Error("Please confirm your account");
      // return null;
      // @TODO: introduce hybrid errors
    }

    // all is well return the user we found

    context.req.session!.userId = user.id;
    // context.userId = user.id;

    const rolesCache: Roles[] = [];

    // It's difficult to get enums into the database
    // properly so we create a cache, use a for-of loop to iterate
    //  and cast as we loop.
    if (user?.roles) {
      for (const theRole of user.roles) {
        rolesCache.push(theRole as Roles);
      }
    }

    const returnUser = {
      ...user,
      name: user.firstName + " " + user.lastName,
      roles: [...rolesCache],
      profileImageUri: user.profileImageUri ? user.profileImageUri : "default-url",
    };
    return returnUser;
  }
}
