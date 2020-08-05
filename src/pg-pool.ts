import pg from "pg";

export default new pg.Pool({
  connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_USER}@localhost:5432/${process.env.POSTGRES_DBNAME}`,

  // connectionString: process.env.PG_CONNECTION_STRING,
  // connectionString:
  //   "postgres://at_system:at_system@localhost:5432/atlas_travel",
  // // connectionString: "postgresql://localhost/atlas_travel",

  // user: process.env.POSTGRES_USER,
  // host: "localhost",
  // database: process.env.POSTGRES_DBNAME,
  // password: process.env.POSTGRES_PASS,
  // port: process.env.POSTGRES_PORT,
}); // process.env.DATABASE_URL });
