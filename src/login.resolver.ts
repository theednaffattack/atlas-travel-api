import { Resolver, Ctx, Arg, Mutation } from "type-graphql";
import bcrypt from "bcrypt";
import { inspect } from "util";
// import { AuthenticationError } from "apollo-server-express";

import * as db from "./zapatos/src";
import * as s from "./zapatos/schema";
import pool from "./pg-pool";

import { User } from "./user.type";
import { MyContext } from "./typings";
import { LoginInput } from "./login.input";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(@Arg("data") { email, password }: LoginInput, @Ctx() context: MyContext): Promise<User | null> {
    // if we can't find a userId on the current session => undefined
    console.log(context.req.session, "VIEW SESSION");

    // let user: User | undefined;
    let user;
    console.log("CHECK USER TYPES - 0", { email, password });

    try {
      user = await db.selectOne("user", { email }).run(pool);
      console.log("CHECK USER TYPES - 1", user);
    } catch (error) {
      console.log("User lookup ERRROR\n", inspect(error));
    }
    console.log("CHECK USER TYPES - 2", user);

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const valid = await bcrypt.compare(password, user.password);

    console.log("CHECK USER TYPES - 3", { user, valid });

    // if the supplied password is invalid return early
    if (!valid) {
      return null;
    }

    // if the user has not confirmed via email
    if (!user.confirmed) {
      throw new Error("Please confirm your account");
      // return null;
    }

    // all is well return the user we found
    context.req.session!.userId = user.id;

    const returnUser = {
      ...user,
      name: user.firstName + " " + user.lastName,
      profileImageUri: user.profileImageUri ? user.profileImageUri : "default-url",
    };
    return returnUser;

    // // === ***************** ===
    // let getMyDetails;
    // const whatIsThis = await db.transaction(pool, db.Isolation.Serializable, async (txnClient) => {
    //   try {
    //     if (process.env.NODE_ENV === "test") {
    //       const temp = await db.selectOne("user", { id: context.req.session?.userId }).run(txnClient);
    //       getMyDetails = {
    //         ...temp,
    //       };
    //       console.log(getMyDetails, "GET MY DETAILS!\n");
    //     } else {
    //       console.log("GET MY DETAILS", getMyDetails);
    //       return await db.selectOne("user", { email: email }).run(txnClient);
    //     }
    //     // if (!getMyDetails) {
    //     //   throw new AuthenticationError("Not authenticated!");
    //     // }

    //     const user = {
    //       // name: getMyDetails ? `${getMyDetails.firstName} ${getMyDetails.lastName}` : "no user found",
    //       ...getMyDetails,
    //       profileImageUri: getMyDetails && getMyDetails.profileImageUri ? getMyDetails.profileImageUri : "",
    //     };
    //     console.log(user, "VIEW USER!\n");

    //     return user;
    //   } catch (err) {
    //     if (err instanceof db.NotExactlyOneError) console.log(`${err.name}: ${err.message}`);
    //     else throw err;
    //   }
    // });

    // const viewFindMe = await findMe(); //.then((data) => data);

    //   console.log(whatIsThis, "what is this?????");

    //   return {
    //     confirmed: false,
    //     createdAt: "",
    //     email: "",
    //     firstName: "",
    //     id: "",
    //     lastName: "",
    //     name: "",
    //     updatedAt: "",
    //   };
    // }
  }
}
