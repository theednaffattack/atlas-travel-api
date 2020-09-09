import { DbMate } from "dbmate";

export async function dropTestDatabase(): Promise<void> {
  const dbmate = new DbMate(process.env.PG_DEV_CONNECTION_STRING as string);
  await dbmate.drop();
}

dropTestDatabase().then(() => process.exit());
