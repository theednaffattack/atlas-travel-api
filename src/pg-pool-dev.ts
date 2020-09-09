import pg from "pg";

export default new pg.Pool({
  connectionString: `${process.env.PG_DEV_CONNECTION_STRING}`,
});
