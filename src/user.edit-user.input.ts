import { InputType, Field, ID } from "type-graphql";

@InputType()
export class EditUserInput {
  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String)
  email!: string;

  @Field(() => ID)
  teamId!: string;
}
