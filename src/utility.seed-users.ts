// utility.seed-hotel-from-element.overpass-json.ts

import bcrypt from "bcrypt";
import { email, first_name, last_name } from "casual";

import prodPool from "./pg-pool";
import testPool from "./pg-pool-test";
import devPool from "./pg-pool-dev";
import * as db from "./zapatos/src";
import { user } from "./zapatos/schema";

import { Pool } from "pg";

type User = user.Insertable;

export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export async function createUsersFromFaker(num: number): Promise<User[]> {
  if (process.env.NODE_ENV === undefined) {
    throw new Error(
      "The NODE_ENV var is undefined. Please set it to 'development', 'production' or 'test' and try again.",
    );
  }

  let poolConnection: Pool;
  if (process.env.NODE_ENV === "test") {
    poolConnection = testPool;
  }
  if (process.env.NODE_ENV === "production") {
    poolConnection = prodPool;
  } else {
    poolConnection = devPool;
  }

  const fakeUsers = [];

  for (let localIndex = 0; localIndex < num; localIndex++) {
    fakeUsers[localIndex] = {
      confirmed: true,
      email: email,
      firstName: first_name,
      lastName: last_name,
      password: await bcrypt.hash("testLoad", 12),
    };
  }

  return await db.insert("user", fakeUsers).run(poolConnection);
}
