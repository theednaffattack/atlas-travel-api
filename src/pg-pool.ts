import pg from "pg";

export default new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
}); // process.env.DATABASE_URL });
