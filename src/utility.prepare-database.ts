import { DbMate } from "dbmate";
import { readdir } from "fs";
import { getConnectionString } from "./utility.get-connection-string";

export async function runMigrations(): Promise<void> {
  // construct a dbmate instance using a database url string
  // see https://github.com/amacneil/dbmate#usage for more details

  const dbConnectionString = getConnectionString(process.env.NODE_ENV);

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
      console.log(`DBMATE INITIATING MIGRATIONS\nRunning ${promiseFileLength} structural migration(s) running.`);

      await dbmate.up();
    } catch (dbmateError) {
      console.error("MIGRATION ERROR\n", dbmateError);
    }
  }
}

runMigrations().then(() => {
  console.log("OKAY RUN MIGRATIONS SCRIPT PROCESS ENDING");
  process.exit();
});
