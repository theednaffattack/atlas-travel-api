import { NextFunction, Request, Response } from "express";
import { GraphQLResolveInfo, GraphQLArgs } from "graphql";
// import DataLoader = require("dataloader");

import { user } from "./zapatos/schema";

interface GraphQlInputs {
  args: GraphQLArgs;
  info: GraphQLResolveInfo;
}

export interface MyContext {
  userId: user.Selectable["id"];
  gqlOpts: GraphQlInputs;
  req: Request;
  res: Response;
  next: NextFunction;
  usersLoader: any;
  connectionName: string;
}
