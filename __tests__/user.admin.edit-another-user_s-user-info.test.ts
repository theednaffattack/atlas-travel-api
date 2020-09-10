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

const newLastName = casual.last_name;

const adminEditUserInfoMutation = `
mutation AdminEditUserInfo($data: EditUserInput!){
  adminEditUserInfo(data: $data){
    id
    firstName
    lastName
    email
  }
}
`;

const variableValues = {
  data: {
    firstName: mockUser.firstName,
    lastName: newLastName,
    email: mockUser.email,
  },
};

describe("Edit user info", () => {
  it("user info to be changed", async (done) => {
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
      source: adminEditUserInfoMutation,
      userId: user.id,
      variableValues,
    });

    expect(response).toMatchObject({
      data: {
        adminEditUserInfo: {
          firstName: user.firstName,
          lastName: newLastName,
        },
      },
    });

    done();
  }, 4000);
});
