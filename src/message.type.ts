import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./user.type";

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field()
  message!: string;

  @Field(() => ID)
  sentBy!: string;

  @Field(() => User)
  user!: User;
}
