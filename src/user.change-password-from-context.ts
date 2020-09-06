import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

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

    const user = await User.findOne(userId);

    // can't find a user in the db
    if (!user) {
      return null;
    }

    // security
    user.password = await bcrypt.hash(password, 12);

    // save updated password
    await user.save();

    // login in the user
    req.session!.userId = user.id;

    return user;
  }
}
