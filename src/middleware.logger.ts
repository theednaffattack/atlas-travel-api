import { MiddlewareFn } from "type-graphql";
import pino from "pino";

import { MyContext } from "./types";

const loggerTransport = pino({
  prettyPrint: true,
});

export const logger: MiddlewareFn<MyContext> = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;

  loggerTransport.info({
    type: "timing",
    name: `${info.parentType.name}.${info.fieldName}`,
    ms: `${resolveTime} ms`,
  });

  // loggerTransport.info(info);
};
