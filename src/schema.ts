import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
// import { merge } from "lodash";

import * as typeDefs from "./schema/schema.graphql";
import { resolvers } from "./resolver-map";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers, // merge(resolvers),
});

export default schema;
