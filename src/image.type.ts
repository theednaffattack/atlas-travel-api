import { Field, ID, ObjectType } from "type-graphql";

// import { UserType as User } from "./types.user";
import { User } from "./user.type";

@ObjectType()
export class Image {
  @Field(() => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  uri!: string;

  @Field(() => User)
  user!: User;
}
