// utility.custom-authorization-checker.ts;

import { AuthChecker } from "type-graphql";
import { MyContext } from "./typings";

export const customAuthorizationChecker: AuthChecker<MyContext> = ({ context: { req } }) => {
  return !!req.session?.userId;
};
