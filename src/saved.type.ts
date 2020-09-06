import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./user.type";

@ObjectType()
export class Saved {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Field(() => User)
  user!: User;
}
