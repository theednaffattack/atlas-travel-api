// import { DbMate } from "dbmate";

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { DbMate } = require("dbmate");

// const dbmate = new DbMate(process.env.PG_TEST_CONNECTION_STRING);

beforeAll(() => {
  // Before execution logic
  console.log("\nbeforeAll executing\n");
});

afterAll(() => {
  // or: afterAll(async () => { }); to support await calls
  // Cleanup logic
  console.log("\nafterAll executing\n");
});
