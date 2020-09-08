import { Arg, Resolver, Mutation, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import * as db from "./zapatos/src";
import pool from "./pg-pool";
import testPool from "./pg-pool-test";
import { User } from "./user.type";
import { RegisterInput } from "./register.input";
import { logger } from "./middleware.logger";
import { sendPostmarkEmail } from "./utility.send-postmark-email";
import { createConfirmationUrl } from "./utility.create-confirmation-url";
import { sendEtherealEmail } from "./utility.send-ethereal-email";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(logger)
  @Mutation(() => User)
  async register(@Arg("data") { email, firstName, lastName, password }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    let user;
    if (process.env.NODE_ENV === "test") {
      user = await db
        .insert("user", {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          profileImageUri: "no-uri",
        })
        .run(testPool);
    } else {
      user = await db
        .insert("user", {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          profileImageUri: "no-uri",
        })
        .run(pool);
    }

    const confEmail = await createConfirmationUrl(user.id);

    if (process.env["NODE_ENV"] === "production") {
      await sendPostmarkEmail(email, confEmail);
      return { ...user, name: `${user.firstName} ${user.lastName}`, profileImageUri: user.profileImageUri ?? "no-uri" };
    } else {
      await sendEtherealEmail(email, confEmail);
      return { ...user, name: `${user.firstName} ${user.lastName}`, profileImageUri: user.profileImageUri ?? "no-uri" };
    }
  }
}
