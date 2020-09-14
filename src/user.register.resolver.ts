import { Arg, Resolver, Mutation, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

import * as db from "./zapatos/src";
import { User, Roles } from "./user.type";
import { RegisterInput } from "./user.register.input";
import { logger } from "./middleware.logger";
import { sendPostmarkEmail } from "./utility.send-postmark-email";
import { createConfirmationUrl } from "./utility.create-confirmation-url";
import { sendEtherealEmail } from "./utility.send-ethereal-email";
import { getConnectionPool } from "./utility.get-connection-pool";
import { setDbConfig } from "./utility.set-db-config";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(logger)
  @Mutation(() => User)
  async register(@Arg("data") { email, firstName, lastName, password }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const pool: Pool = getConnectionPool(process.env.NODE_ENV);

    // If the NODE_ENV is "development" show Zapatos(postgres)
    //  query and result logs.
    if (process.env.NODE_ENV === "development") {
      setDbConfig(process.env.NODE_ENV);
    }

    const user = await db
      .insert("user", {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        profileImageUri: "no-uri",
      })
      .run(pool);

    const confEmail = await createConfirmationUrl(user.id);

    const rolesCache: Roles[] = [];

    // It's difficult to get enums into the database
    // properly so we create a cache, use a for-of loop to iterate
    //  and cast as we loop.
    if (user?.roles) {
      for (const theRole of user.roles) {
        rolesCache.push(theRole as Roles);
      }
    }

    if (process.env["NODE_ENV"] === "production") {
      await sendPostmarkEmail(email, confEmail);
      return {
        ...user,
        roles: [...rolesCache],
        name: `${user.firstName} ${user.lastName}`,
        profileImageUri: user.profileImageUri ?? "no-uri",
      };
    } else {
      await sendEtherealEmail(email, confEmail);
      return {
        ...user,
        roles: [...rolesCache],
        name: `${user.firstName} ${user.lastName}`,
        profileImageUri: user.profileImageUri ?? "no-uri",
      };
    }
  }
}
