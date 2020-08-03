import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import { merge } from "lodash";

import * as typeDefs from "./schema/schema.graphql";
import { bookResolver } from "./graphql/resolvers/book-example";

// import { resolvers } from "./resolver-map";

const resolvers = {
  Query: {
    book: () => {
      return { name: "A Sample Book" };
    },
  },
};

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(resolvers, bookResolver),
});

export default schema;
