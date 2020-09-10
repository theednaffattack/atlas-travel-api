import { Pool } from "pg";

import prodPool from "./pg-pool";
import testPool from "./pg-pool-test";
import devPool from "./pg-pool-dev";
import { nodeEnvIsUndefined } from "./utility.errors";

export function getConnectionPool(env: string | undefined): Pool {
  if (!env) {
    throw new Error(nodeEnvIsUndefined("getConnectionPool"));
  }
  if (env === "test") {
    return testPool;
  }
  if (env === "production") {
    return prodPool;
  } else {
    return devPool;
  }
}
