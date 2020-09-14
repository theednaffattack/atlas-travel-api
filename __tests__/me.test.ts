import casual from "casual";

import pool from "../src/pg-pool-test";
import * as db from "../src/zapatos/src";
import * as theSchema from "../src/zapatos/schema";
import { gqlCall } from "../src/test-utility.gql-call";

const mockUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
  roles: ["administrator", "app_user"] as theSchema.user.Insertable["roles"],
};

const meQuery = `
{
    me{
      firstName
      lastName
      email
      id
    }
  }
`;

describe("Me", () => {
  it("get user info", async (done) => {
    const user = await db
      .insert("user", {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: mockUser.password,
        roles: mockUser.roles,
        confirmed: true,
      })
      .run(pool);

    const response = await gqlCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
    done();
  }, 4000);

  it("returns null", async (done) => {
    // call resolver
    const response = await gqlCall({
      source: meQuery,
      variableValues: { checkNull: "fired from check if user is null (it should be)" },
    });

    // basically a test for an un-authenticated (not logged in)
    // user
    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
    done();
  }, 4000);
});
