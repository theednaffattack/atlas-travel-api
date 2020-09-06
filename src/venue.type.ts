import { Field, ID, ObjectType } from "type-graphql";
import { Max } from "class-validator";

import { Photo } from "./photo.type";
import { Review } from "./review.type";
import { VenueSeating } from "./venue-seating.type";
import { EventEntity } from "./event.type";
import { PointObject } from "./hotel.type";

@ObjectType()
export class Venue {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [EventEntity], { nullable: "itemsAndList" })
  events?: EventEntity[];

  @Field(() => Photo, { nullable: true })
  photos?: Photo[];

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  type?: string[];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field(() => [VenueSeating], { nullable: true })
  seats?: VenueSeating[];

  @Field({ nullable: true })
  loveCount!: number;

  @Field({ nullable: true })
  commentCount?: number;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  suite?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  @Max(5)
  zipCode?: string;

  @Field({ nullable: true })
  @Max(4)
  zipCodeSuffix?: number;

  @Field(() => PointObject, { nullable: true })
  coordinates?: PointObject;
}
