import { IResolvers } from "graphql-tools";

import * as db from "./zapatos/src";
import * as s from "./zapatos/schema";
import pool from "./pg-pool";
import { MyContext } from "./typings";

export const resolvers: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string {
      return `👋🏾 Hello world! 👋🏾`;
    },
    async me(parent, args, context: MyContext, info) {
      // if we can't find a userId on the current session
      if (!context.req.session!.userId) {
        return undefined;
      }

      // selectExactlyOne, Whereable
      // for a more useful example, see the section on `lateral`, below
      try {
        const exactlyOneUser = await db
          .selectExactlyOne("user", { id: context.userId })
          .run(pool);
        // ... do something with this user ...
        return exactlyOneUser;
      } catch (err) {
        if (err instanceof db.NotExactlyOneError)
          console.log(`${err.name}: ${err.message}`);
        else throw err;
      }
    },
  },
};
