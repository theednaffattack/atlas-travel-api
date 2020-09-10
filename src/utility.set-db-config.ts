import { highlight } from "sql-highlight";

import * as db from "./zapatos/src";
import { QuerySentInterface } from "./old-resolver-map";
import { highlighterOptions } from "./global-utilities";

export function setDbConfig(env: string | undefined): void {
  if (env === undefined) {
    throw new Error("NODE_ENV is undefined. Please set the environment variable and try again.");
  }
  if (env && env !== "production") {
    db.setConfig({
      queryListener: (argThing: QuerySentInterface) => {
        const highlightThing = highlight(argThing.text, highlighterOptions);
        console.log(`
        =====================
        QUERY
        ${highlightThing}
        VALUES
        ${argThing.values}
        =====================
        `);
      },
      resultListener: (argThing) => {
        console.log(`
        =====================
        RESULT
        ${argThing}
        =====================
        `);
      },
    });
  } else {
    return;
  }
}
