// utility.custom-authorization-checker.ts;
import { Pool } from "pg";

import { AuthChecker } from "type-graphql";
import { MyContext } from "./typings";
import * as db from "./zapatos/src";
import { getConnectionPool } from "./utility.get-connection-pool";

const pool: Pool = getConnectionPool(process.env.NODE_ENV as string);

export const customAuthorizationChecker: AuthChecker<MyContext> = async ({ context: { req } }, roles) => {
  // return !!req.session?.userId;
  const user = await db.selectOne("user", { id: req.session?.userId }).run(pool);

  let returnBoolean;
  if (user && user.roles && user.roles.length > 0) {
    returnBoolean = user.roles.includes("administrator");
  } else {
    returnBoolean = false;
  }
  return returnBoolean;
};
