import casual from "casual";

import testPool from "../src/pg-pool-test";
import * as db from "../src/zapatos/src";
import { gqlCall } from "../src/test-utility.gql-call";

const registerMutation = `
mutation Register($data: RegisterInput!){
  register(data: $data){
    id
    firstName
    lastName
    email
  }
}
`;

const variableValues = {
  data: {
    firstName: casual.first_name,
    lastName: casual.last_name,
    email: "fred" + casual.email,
    password: casual.password,
  },
};

describe("Register", () => {
  it("create user", async (done) => {
    const response = await gqlCall({ source: registerMutation, variableValues });
    const { data: user } = variableValues;
    expect(response).toMatchObject({
      data: {
        register: {
          id: response.data.register.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    const dbUser = await db.selectOne("user", { email: user.email }).run(testPool);

    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);

    done();
  }, 9000);
});
