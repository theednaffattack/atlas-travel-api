import { Field, ID, ObjectType } from "type-graphql";
import { Hotel } from "./hotel.type";
import { Reservation } from "./reservation.type";

@ObjectType()
export class Room {
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

  @Field(() => [Reservation], { nullable: true })
  reservations!: Reservation[];

  @Field({ nullable: true })
  hotelId!: string;

  @Field(() => Hotel)
  hotel!: Hotel;
}
