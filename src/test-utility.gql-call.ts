import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import "reflect-metadata";

import { createSchema } from "./utility.create-schema";

// prettier-ignore
interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: string;
}

let schema: GraphQLSchema;

export const gqlCall = async ({ source, variableValues, userId }: Options): Promise<any> => {
  if (!schema) {
    schema = await createSchema();
  }

  return await graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: (): jest.Mock<any, any> => jest.fn(),
      },
      userId,
    },
  });
};
