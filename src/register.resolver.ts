import { Arg, Resolver, Query, Mutation, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "./user.type";
import { RegisterInput } from "./register.input";
import { logger } from "./middleware.logger";
import { sendPostmarkEmail } from "./utility.send-postmark-email";
import { createConfirmationUrl } from "./utility.create-confirmation-url";
import { sendEtherealEmail } from "./utility.send-ethereal-email";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(logger)
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello(): Promise<string> {
    return "Hello World";
  }

  @Mutation(() => User)
  async register(@Arg("data") { email, firstName, lastName, password }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    if (process.env.NODE_ENV === "production") {
      const seeResponse = await sendPostmarkEmail(email, await createConfirmationUrl(user.id));
      console.log("seeMailResponse", seeResponse);
    }
    if (process.env.NODE_ENV === "test") {
      const seeResponse = await sendEtherealEmail(email, await createConfirmationUrl(user.id));
      console.log("seeMailResponse", seeResponse);
    }
    return user;
  }
}
