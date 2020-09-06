import { Field, ID, ObjectType, Root } from "type-graphql";

import { EventEntity } from "./event.type";
import { Image } from "./image.type";
import { Message } from "./message.type";
import { Reservation } from "./reservation.type";
import { Review } from "./review.type";
import { Saved } from "./saved.type";
import { HotelLike } from "./hotel-like";

/**
 * User Entity (model)
 * @param {string} User.id - The ID of a User
 * @param {string} User.firstName - The given name of a User
 * @param {string} User.lastName - The family name (surname) of a User
 */

// prettier-ignore
@ObjectType()
export class User  {
  /**id field */
  @Field(() => ID, { nullable: true })
  id!: string;


  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  email!: string;

  @Field(() => [Message], { nullable: "itemsAndList"})
  messages?: Message[];

  @Field(() => [EventEntity], { nullable: "itemsAndList" })
  event_ownerships?: EventEntity[];

  @Field(() => [HotelLike], { nullable: "itemsAndList" })
  hotelLikes?: HotelLike[];

  @Field(() => [Saved], { nullable: true })
  savedItems?: Saved[];
  
  @Field(() => [Reservation], { nullable: "itemsAndList" })
  reservations?: Reservation[];
  
  @Field(() => [EventEntity], { nullable: "itemsAndList" })
  events?: EventEntity[];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];


  @Field(() => [User], { nullable: "itemsAndList" })
  followers?: User[];

  @Field(() => [User], { nullable: "itemsAndList" })
  following?: User[];

  @Field()
  profileImageUri?: string;

  @Field()
  password!: string;

  // @Field()
  // name(@Root() parent: User): string {
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  @Field()
  name!: string;

  @Field()
  confirmed!: boolean;

  @Field(() => [Image], {nullable: "itemsAndList"})
  images?: Image[];
}

@ObjectType()
export class UserClassTypeWithReferenceIds {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  email!: string;

  @Field(() => [Message], { nullable: "itemsAndList" })
  messages?: Message[];

  @Field(() => [Reservation], { nullable: "itemsAndList" })
  reservations?: Reservation[];

  @Field(() => Review, { nullable: true })
  reviewLikes?: [];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field(() => [User], { nullable: "itemsAndList" })
  followers!: User[];

  @Field(() => [User], { nullable: "itemsAndList" })
  following!: User[];

  @Field({ nullable: true })
  profileImageUri!: string;

  @Field({ nullable: true })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // @Column() password!: string;

  @Field()
  confirmed!: boolean;
}
