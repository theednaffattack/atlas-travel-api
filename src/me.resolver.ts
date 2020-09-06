import { Resolver, Query, Ctx } from "type-graphql";

import * as db from "./zapatos/src";
import * as s from "./zapatos/schema";

import pool from "./pg-pool";

import { User } from "./user.type";
import { MyContext } from "./typings";
import { AuthenticationError } from "apollo-server-express";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext): Promise<User | undefined> {
    // if we can't find a userId on the current session => undefined

    if (!context.req.session!.userId) {
      return undefined;
    }

    const findMe = await db.transaction(pool, db.Isolation.Serializable, async (txnClient) => {
      try {
        return await db.selectExactlyOne("user", { id: context.userId }).run(txnClient);
      } catch (err) {
        if (err instanceof db.NotExactlyOneError) console.log(`${err.name}: ${err.message}`);
        // else throw err;
        else throw new AuthenticationError("Not authenticated!");
      }

      // try {
      //   if (process.env.NODE_ENV === "test") {
      //     getMyDetails = await db.selectOne("user", { id: context.req.session?.userId }).run(txnClient);
      //   } else {
      //     getMyDetails = await db.selectOne("user", { id: context.userId }).run(txnClient);
      //   }
      //   if (!getMyDetails) {
      //     throw new AuthenticationError("Not authenticated!");
      //   }

      //   const user = {
      //     name: `${getMyDetails.firstName} ${getMyDetails.lastName}`,
      //     ...getMyDetails,
      //     profileImageUri: getMyDetails.profileImageUri ? getMyDetails.profileImageUri : "",
      //   };

      //   return user;
      // } catch (err) {
      //   if (err instanceof db.NotExactlyOneError) console.log(`${err.name}: ${err.message}`);
      //   else throw err;
      // }
    });

    if (findMe && findMe.id) {
      return {
        ...findMe,
        name: findMe.firstName + " " + findMe.lastName,
        profileImageUri: findMe.profileImageUri ? findMe.profileImageUri : "",
      };
    } else {
      throw new AuthenticationError("Not authenticated");
    }
  }
}
