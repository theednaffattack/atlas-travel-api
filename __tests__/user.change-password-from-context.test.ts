import casual from "casual";

import testPool from "../src/pg-pool-test";
import * as db from "../src/zapatos/src";
import { gqlCall } from "../src/test-utility.gql-call";

const mockUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
};

const changePasswordFromContextUseridQuery = `
mutation ChangePasswordFromContextUserid($data: PasswordInput!){
  changePasswordFromContextUserid(data: $data){
    id
    firstName
  }
  }
`;

const variableValues = {
  data: { password: "testLoad" },
};

describe("Change password from context obtained User ID", () => {
  it("get user info", async (done) => {
    const user = await db
      .insert("user", {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: mockUser.password,
        confirmed: true,
      })
      .run(testPool);

    const response = await gqlCall({
      source: changePasswordFromContextUseridQuery,
      userId: user.id,
      variableValues,
    });

    expect(response).toMatchObject({
      data: {
        changePasswordFromContextUserid: {
          id: user.id,
          firstName: user.firstName,
        },
      },
    });

    const dbUser = await db.selectOne("user", { id: user.id }).run(testPool);

    if (dbUser) {
      expect(dbUser).toBeDefined();
      expect({ data: { id: dbUser.id, firstName: dbUser.firstName } }).toMatchObject({
        data: {
          id: user.id,
          firstName: user.firstName,
        },
      });
    } else {
      // Make the test fail because we returned null
      // from the database. It's expected in this else block.
      // But otherwise you get typescript errors above, which
      // is why the if assertion is added in the first place
      expect(dbUser).toBeDefined();
    }
    done();
  }, 4000);
});
