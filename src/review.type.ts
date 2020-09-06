import { ObjectType, Field, Float, ID } from "type-graphql";

import { User } from "./user.type";
import { Hotel } from "./hotel.type";
import { Venue } from "./venue.type";

// prettier-ignore
@ObjectType()
export class Review  {
  @Field(() => ID)
  id!: string;
  
  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;


  
  @Field(() => Float)
  value!: number;

  @Field()
  title!: string;

  @Field()
  text!: string;
  
  @Field({ nullable!: true })
  userId!: string;

  @Field(() => User)
  user!: User;

  @Field({ nullable!: true })
  hotelId!: string;
  
  @Field(() => Hotel)
  hotel!: Hotel;

  @Field({ nullable!: true })
  venueId!: string;
  
  @Field(() => Venue)
  venue!: Venue;
}
