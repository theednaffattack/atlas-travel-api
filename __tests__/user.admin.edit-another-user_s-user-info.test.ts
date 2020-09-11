import casual from "casual";

import testPool from "../src/pg-pool-test";
import * as db from "../src/zapatos/src";
import { gqlCall } from "../src/test-utility.gql-call";

const adminUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
};

const generalUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
};

const newLastName = casual.last_name;

const adminEditAnotherUser_sInfo = `
mutation AdminEditAnotherUser_sInfo($data: EditUserInput!) {
  adminEditAnotherUser_sInfo(data: $data) {
    id
    firstName
  }
}

`;

const variableValues = {
  data: {
    firstName: generalUser.firstName,
    lastName: newLastName,
    email: generalUser.email,
  },
};

describe("Edit another user's info", () => {
  it("user info to be changed", async (done) => {
    const [user, userToo] = await db.insert("user", [adminUser, generalUser]).run(testPool);

    const response = await gqlCall({
      source: adminEditAnotherUser_sInfo,
      userId: user.id,
      variableValues,
    });

    expect(response).toMatchObject({
      data: {
        adminEditAnotherUser_sInfo: {
          firstName: userToo.firstName,
          lastName: newLastName,
        },
      },
    });

    done();
  }, 4000);
});
