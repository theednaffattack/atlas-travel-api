import { graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import { schema } from "./test-utility.build-schema";

// prettier-ignore
interface Options {
  source: string;
  variableValues?: Maybe<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  userId?: string;
}

// let schema: GraphQLSchema;

export const gqlCall = async ({
  source,
  variableValues,
  userId,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Options): Promise<any> => {
  // if (!schema) {
  //   schema = await createSchema();
  // }

  return graphql({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearCookie: (): jest.Mock<any, any> => jest.fn(),
      },
    },
  });
};
