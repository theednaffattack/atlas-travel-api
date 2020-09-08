import { Field, Int, InputType } from "type-graphql";

import { AmenityInput } from "./hotel.amenity-input";
import { DateSimpleInput } from "./hotel.date-simple.input";
import { PriceRangeInput } from "./hotel.price-range.input";

@InputType()
export class GetAllHotelInput {
  @Field(() => Int)
  skip!: number;

  @Field()
  take!: number; // Int = 25;

  @Field()
  dates!: DateSimpleInput;

  @Field()
  from!: string;

  @Field()
  to!: string;

  @Field()
  prices!: PriceRangeInput;

  @Field()
  amenities!: [AmenityInput];
}
