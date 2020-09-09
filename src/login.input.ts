import { InputType, Field } from "type-graphql";

import { PasswordInput } from "./password.input";
import { IsEmail } from "class-validator";
import { DoesEmailAlreadyExist } from "./utility.does-email-already-exist";

@InputType({ description: "Login input" })
export class LoginInput extends PasswordInput {
  @Field()
  @IsEmail()
  @DoesEmailAlreadyExist({ message: "This email is already in use." })
  email!: string;
}
