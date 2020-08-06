import casual from "casual";

import pool from "../src/pg-pool";
// import * as s from "../src/zapatos/schema";
import * as db from "../src/zapatos/src";
import { gqlCall } from "../src/test-utils/gql-call";

const mockUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
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
        confirmed: true,
      })
      .run(pool);
    let response;

    // did we insert a user?
    if (user && user.id) {
      // call resolver
      response = await gqlCall({
        source: meQuery,
        variableValues: { getUserInfo: "fired from get user info" },
        userId: user.id,
      });
    }

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

    // basically a test for an authenticated (logged in)
    // user
    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
    done();
  }, 4000);
});
