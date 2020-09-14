import casual from "casual";

import testPool from "../src/pg-pool-test";
import * as db from "../src/zapatos/src";
import * as theSchema from "../src/zapatos/schema";
import { gqlCall } from "../src/test-utility.gql-call";

const adminUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
  roles: ["administrator", "app_user"] as theSchema.user.Insertable["roles"],
};

// const notAdminUser = {
//   firstName: casual.first_name,
//   lastName: casual.last_name,
//   email: casual.email,
//   password: casual.password,
//   roles: ["appUser"],
// };

const editedUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
  roles: ["app_user"] as theSchema.user.Insertable["roles"],
};

const newLastName = casual.last_name;

const adminEditAnotherUser_sInfo = `
mutation AdminEditAnotherUser_sInfo($data: AdminEditUserInput!) {
  adminEditAnotherUser_sInfo(data: $data) {
    id
    firstName
    lastName
    email
  }
}

`;

describe("Edit another user's info", () => {
  it("user info to be changed", async (done) => {
    const [adminUserData, editedUserData] = await db.insert("user", [adminUser, editedUser]).run(testPool);

    const variableValues = {
      data: {
        userIdToBeChanged: editedUserData.id,
        firstName: editedUser.firstName,
        lastName: newLastName,
        email: editedUser.email,
      },
    };

    const response = await gqlCall({
      source: adminEditAnotherUser_sInfo,
      userId: adminUserData.id,
      variableValues,
    });

    expect(response).toMatchObject({
      data: {
        adminEditAnotherUser_sInfo: {
          email: editedUser.email,
          firstName: editedUser.firstName,
          id: editedUserData.id,
          lastName: newLastName,
        },
      },
    });

    done();
  }, 4000);
});
