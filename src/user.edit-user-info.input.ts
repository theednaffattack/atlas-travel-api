import { Length, IsEmail } from "class-validator";
import { Field, InputType, ID } from "type-graphql";

@InputType()
export class EditUserInput {
  @Field(() => String)
  @Length(1, 255)
  firstName!: string;

  @Field(() => String)
  @Length(1, 255)
  lastName!: string;

  @Field(() => String)
  @IsEmail()
  email?: string;
}
