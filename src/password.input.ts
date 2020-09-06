import { MinLength } from "class-validator";
import { Field, InputType, ClassType } from "type-graphql";

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PasswordInputMixed extends BaseClass {
    @Field()
    @MinLength(5)
    password!: string;
  }
  return PasswordInputMixed;
};

@InputType()
export class PasswordInput {
  @Field()
  @MinLength(5)
  password!: string;
}
