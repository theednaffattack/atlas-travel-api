import { ID, Field, ArgsType } from "type-graphql";

@ArgsType()
export class NewCommentsArgs {
  @Field(() => ID)
  recipeId!: string;
}
