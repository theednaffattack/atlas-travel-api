import pg from "pg";

export default new pg.Pool({
  connectionString: `${process.env.PG_PROD_CONNECTION_STRING}`,
});
