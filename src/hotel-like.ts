import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./user.type";
import { Hotel } from "./hotel.type";

export interface CommentPayload {
  id: number;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sentBy?: string;
  user?: User;
}

@ObjectType()
export class HotelLike {
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => ID)
  hotelId!: string;

  @Field(() => Hotel)
  hotel!: Hotel;

  @Field(() => ID)
  userId!: string;

  @Field(() => User)
  user!: User;
}
