import { Resolver, Ctx, Arg, Mutation } from "type-graphql";
import bcrypt from "bcrypt";
import { inspect } from "util";
// import { AuthenticationError } from "apollo-server-express";

import * as db from "./zapatos/src";
import pool from "./pg-pool";

import { User } from "./user.type";
import { MyContext } from "./typings";
import { LoginInput } from "./login.input";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(@Arg("data") { email, password }: LoginInput, @Ctx() context: MyContext): Promise<User | null> {
    // let user: User | undefined;
    let user;

    try {
      user = await db.selectOne("user", { email }).run(pool);
    } catch (error) {
      console.log("User lookup ERRROR\n", inspect(error));
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

    const returnUser = {
      ...user,
      name: user.firstName + " " + user.lastName,
      profileImageUri: user.profileImageUri ? user.profileImageUri : "default-url",
    };
    return returnUser;
  }
}
