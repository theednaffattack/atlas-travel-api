import { ObjectType, Field, ID } from "type-graphql";

import { Comment } from "./comment.type";

@ObjectType()
export class Recipe {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field((type) => [Comment])
  comments!: Comment[];
}
