import { Resolver, Query, UseMiddleware } from "type-graphql";

import { logger } from "./middleware.logger";

@Resolver()
export class HelloWorldResolver {
  @UseMiddleware(logger)
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello(): Promise<string> {
    return "Hello World";
  }
}
