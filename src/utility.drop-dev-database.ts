import { DbMate } from "dbmate";

export async function dropDevDatabase(): Promise<void> {
  const dbmate = new DbMate(process.env.PG_DEV_CONNECTION_STRING as string);
  await dbmate.drop();
}

dropDevDatabase()
  .then(() => process.exit())
  .catch(catchError);

function catchError(error: Error): void {
  console.warn("Error dropping dev database script\n", error);
}
