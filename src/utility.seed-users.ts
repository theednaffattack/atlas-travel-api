// utility.seed-hotel-from-element.overpass-json.ts

import bcrypt from "bcrypt";
import { email, first_name, last_name } from "casual";

import * as db from "./zapatos/src";
import { user } from "./zapatos/schema";

import { Pool } from "pg";
import { getConnectionPool } from "./utility.get-connection-pool";

type User = user.Insertable;

export async function createUsersFromFaker(num: number): Promise<User[]> {
  const pool: Pool = getConnectionPool(process.env.NODE_ENV);

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

  return await db.insert("user", fakeUsers).run(pool);
}
