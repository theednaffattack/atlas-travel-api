import { InputType, Field } from "type-graphql";

@InputType()
export class AmenityInput {
  @Field(() => [String], { nullable: "items" })
  name!: string[];
}
