import { NextFunction, Request, Response } from "express";
import { GraphQLResolveInfo, GraphQLArgs } from "graphql";
import { User } from "./user.type";
// import DataLoader = require("dataloader");

interface GraphQlInputs {
  args: GraphQLArgs;
  info: GraphQLResolveInfo;
}

export interface MyContext {
  userId: User["id"];
  gqlOpts: GraphQlInputs;
  req: Request;
  res: Response;
  next: NextFunction;
  usersLoader: any;
  connectionName: string;
}

export interface MessagePayload {
  id: number;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sentBy?: string;
  user?: User;
}
