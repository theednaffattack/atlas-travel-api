import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./user.type";
import { Venue } from "./venue";

@ObjectType()
export class EventEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => User)
  attendees!: User[];

  @Field(() => Date)
  end_time!: Date;

  @Field()
  name!: string;

  @Field(() => ID)
  organizerId!: string;

  @Field(() => User)
  organizer!: User;

  @Field()
  price!: number;

  @Field(() => Date)
  start_time!: Date;

  @Field(() => ID)
  venueId!: string;

  @Field(() => Venue)
  venue!: Venue;
}
