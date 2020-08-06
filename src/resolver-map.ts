import { IResolvers } from "graphql-tools";
import bcrypt from "bcrypt";

import { highlight } from "sql-highlight/dist";

import * as db from "./zapatos/src";
import * as s from "./zapatos/schema";
import pool from "./pg-pool";
import { MyContext } from "./typings";
import { transaction } from "./zapatos/src";
import { MyContext } from "./typings";
import { AuthenticationError } from "apollo-server-express";

interface LoginArgs {
  email: string;
  password: string;
}

export interface QuerySentInterface {
  text: string;
  values: (string | number)[];
}

function createNameField({ firstName, lastName }: { firstName: string; lastName: string }): string {
  return firstName + " " + lastName;
}

type UserType =
  | {
      name: string;
      firstName: string;
      id: string;
      lastName: string;
      profileImageUri: string | null;
    }
  | null
  | undefined;

interface MessageInterface {
  id: string;
  message?: string;
  sentBy?: string | null;
  userId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type MessagesSubType = MessageInterface[] | null;

export const resolvers: IResolvers = {
  Query: {
    async getMyMessages(_parent, _args, context: MyContext): Promise<MessagesSubType> {
      try {
        const messages = await db.sql<s.message.SQL, s.message.Selectable[]>`
        SELECT * FROM ${"message"} WHERE ${"userId"} = ${db.param(context.userId)} OR ${"sentBy"} = ${db.param(
          context.userId,
        )}
        `.run(pool);

        console.log("CAN I SEE MESSAGES\n", messages);

        return messages;
        // const theMessages = await db
        //   .select("message", { userId: context.userId })
        //   .run(pool);
      } catch (error) {
        // if (error instanceof db.NotExactlyOneError)
        console.log(`${error.name}: ${error.message}`);
        throw error;
      }
    },
    helloWorld(_: void, args: void): string {
      return `👋🏾 Hello world! 👋🏾`;
    },
    async me(_parent, _args, context: MyContext): Promise<UserType> {
      // if we can't find a userId on the current session => undefined
      if (!context.req.session!.userId) {
        return undefined;
      }

      try {
        const getMyDetails = await db.selectOne("user", { id: context.userId }).run(pool);
        // ... do something with this user ...

        if (!getMyDetails) {
          throw new AuthenticationError("Not authenticated!");
        }

        const user = {
          name: createNameField({
            firstName: getMyDetails.firstName,
            lastName: getMyDetails.lastName,
          }),
          ...getMyDetails,
        };

        return user;
      } catch (err) {
        if (err instanceof db.NotExactlyOneError) console.log(`${err.name}: ${err.message}`);
        else throw err;
      }
    },
  },
  Mutation: {
    async login(_, { email, password }: LoginArgs, context: MyContext): Promise<UserType> {
      const { req } = context;

      let user;

      try {
        // START - logging

        await db.setConfig({
          queryListener: (argThing: QuerySentInterface) => {
            const highlightThing = highlight(argThing.text, highlighterOptions);
            console.log("\n=====================");
            console.log("START QUERY LISTENER");
            console.log("=====================\n");
            console.log("QUERY");
            console.log(highlightThing);
            console.log("\nVALUES");
            console.log(argThing.values);
            console.log("\n=====================");
            console.log("END QUERY LISTENER");
            console.log("=====================\n");
          },
          resultListener: (argThing) => {
            console.log("\n=====================");
            console.log("START RESULTS LISTENER");
            console.log("=====================\n");
            console.log(argThing);
            console.log("\n=====================");
            console.log("END RESULTS LISTENER");
            console.log("=====================\n");
          },
        });

        // END - logging

        const tempUser = await db.selectOne("user", { email }).run(pool);
        if (!tempUser) {
          throw new Error("Could not find user!");
        }
        user = {
          name: createNameField({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
          }),
          ...tempUser,
        };
      } catch (error) {
        console.log("ERROR", error);
        if (error instanceof db.NotExactlyOneError) {
          console.log(`${error.name}: ${error.message}`);
        }
        throw new Error(error);
      }

      // if the user can't be found return early
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
      }

      // all is well return the user we found
      req.session!.userId = user.id;
      return user;
    },
  },
};
