import casual from "casual";

import pool from "../src/pg-pool-test";
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
    const { data } = await gqlCall({ source: registerMutation, variableValues });

    expect(data).toMatchObject({
      register: {
        id: data.register.id,
        firstName: variableValues.data.firstName,
        lastName: variableValues.data.lastName,
        email: variableValues.data.email,
      },
    });

    done();
  }, 9000);
});
