import { DbMate } from "dbmate";
import { readdir } from "fs";

export async function runMigrations(): Promise<void> {
  // construct a dbmate instance using a database url string
  // see https://github.com/amacneil/dbmate#usage for more details

  const dbmate = new DbMate(process.env.PG_TEST_CONNECTION_STRING as string);

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
      console.log(`DBMATE HAS BEEN STARTED\nRunning ${promiseFileLength} migrations.`);
    } catch (dbmateError) {
      console.error("MIGRATION ERROR\n", dbmateError);
    }
  }
}

runMigrations().then(() => process.exit());
