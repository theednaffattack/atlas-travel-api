import { InputType, Field, Int } from "type-graphql";

@InputType()
export class PriceRangeInput {
  @Field(() => Int)
  low!: number;

  @Field(() => Int)
  high!: number;
}
