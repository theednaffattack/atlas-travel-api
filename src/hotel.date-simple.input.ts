import { InputType, Field } from "type-graphql";

@InputType()
export class DateSimpleInput {
  @Field()
  from!: string;

  @Field()
  to!: string;
}
