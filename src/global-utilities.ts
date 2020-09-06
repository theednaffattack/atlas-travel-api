import { highlight } from "sql-highlight/dist";

import * as db from "./zapatos/src";
import { QuerySentInterface } from "./old-resolver-map";

export const highlighterOptions = {
  html: false,
  classPrefix: "sql-hl-",
  colors: {
    keyword: "\x1b[35m",
    function: "\x1b[31m",
    number: "\x1b[32m",
    string: "\x1b[32m",
    special: "\x1b[33m",
    bracket: "\x1b[33m",
  },
};

export async function highlightSql(): Promise<void> {
  try {
    await db.setConfig({
      queryListener: (argThing: QuerySentInterface) => {
        const highlightThing = highlight(argThing.text, highlighterOptions);
        console.log("\n=====================");
        console.log("START QUERY LISTENER");
        console.log("=====================\n");
        console.log("QUERY");
        console.log(highlightThing);
        console.log("\nVALUES");
        console.log(argThing.values);
        console.log("\n=====================");
        console.log("END QUERY LISTENER");
        console.log("=====================\n");
      },
      resultListener: (argThing) => {
        console.log("\n=====================");
        console.log("START RESULTS LISTENER");
        console.log("=====================\n");
        console.log(argThing);
        console.log("\n=====================");
        console.log("END RESULTS LISTENER");
        console.log("=====================\n");
      },
    });
  } catch (error) {
    console.log("ERROR", error);
    if (error instanceof db.NotExactlyOneError) {
      console.log(`${error.name}: ${error.message}`);
    }
    throw new Error(error);
  }
}
