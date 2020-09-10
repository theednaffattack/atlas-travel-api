import { DbMate } from "dbmate";

export async function dropDevDatabase(): Promise<void> {
  const dbmate = new DbMate(process.env.PG_DEV_CONNECTION_STRING as string);
  await dbmate.drop();
}

dropDevDatabase().then(() => process.exit());
