import { DbMate } from "dbmate";
import { readdir } from "fs";

export async function runMigrations(): Promise<void> {
  // construct a dbmate instance using a database url string
  // see https://github.com/amacneil/dbmate#usage for more details

  let dbConnectionString: string;

  if (process.env.NODE_ENV === undefined) {
    throw new Error(
      "The NODE_ENV var is undefined. Please set it to 'development', 'production' or 'test' and try again.",
    );
  }
  if (process.env.NODE_ENV === "test") {
    dbConnectionString = process.env.PG_TEST_CONNECTION_STRING as string;
  }
  if (process.env.NODE_ENV === "production") {
    dbConnectionString = process.env.PG_PROD_CONNECTION_STRING as string;
  } else {
    dbConnectionString = process.env.PG_DEV_CONNECTION_STRING as string;
  }

  const dbmate = new DbMate(dbConnectionString);

  const promiseFileLength = await new Promise<number>((resolve, reject) => {
    readdir(`${process.cwd()}/db/migrations`, function (error, files) {
      if (error) {
        reject(error);
      } else {
        resolve(files.length);
      }
      return;
    });
  });

  // invoke up, down, drop as necessary
  if (promiseFileLength !== undefined && promiseFileLength > 0) {
    try {
      await dbmate.up();
      console.log(`DBMATE HAS BEEN STARTED\nRunning ${promiseFileLength} structural migration(s) running.`);
    } catch (dbmateError) {
      console.error("MIGRATION ERROR\n", dbmateError);
    }
  }
}

runMigrations().then(() => process.exit());
