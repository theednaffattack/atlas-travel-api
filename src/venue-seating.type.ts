import { Field, ID, ObjectType } from "type-graphql";

import { Venue } from "./venue.type";
import { Reservation } from "./reservation.type";

// prettier-ignore
@ObjectType()
export class VenueSeating {
  @Field(() => ID)
  id!: string;

  @Field()
  roomNumber!: string;

  @Field()
  type!: string;

  @Field()
  beds!: number;

  @Field()
  maxOccupancy!: number;

  @Field()
  costPerNight!: number;

  @Field(() => [Reservation], { nullable!: true })
  reserved!: Reservation[];

  @Field(() => Venue)
  venue!: Venue;
}
