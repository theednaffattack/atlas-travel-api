import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

import { DoesEmailAlreadyExist } from "./utility.does-email-already-exist";
import { PasswordInput } from "./password.input";

// prettier-ignore
@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  firstName!: string;

  @Field()
  @Length(1, 255)
  lastName!: string;

  @Field()
  @IsEmail()
  @DoesEmailAlreadyExist({ message: "This email is already in use." })
  email!: string;
}
