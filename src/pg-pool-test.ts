import pg from "pg";

export default new pg.Pool({
  connectionString: `${process.env.PG_TEST_CONNECTION_STRING}`,
});
