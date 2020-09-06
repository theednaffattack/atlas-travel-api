import { Field, ID, ObjectType, Int } from "type-graphql";
import { Max } from "class-validator";

import { HotelLike } from "./hotel-like";
import { Photo } from "./photo.type";
import { Review } from "./review.type";
import { Room } from "./room.type";

@ObjectType()
export class PointObject {
  @Field()
  longitude?: number;
  @Field()
  latitude?: number;
}

@ObjectType()
export class PointObjectClassType {
  @Field()
  type?: "Point";

  @Field(() => [Int])
  coordinates?: number[];
}

@ObjectType()
export class Hotel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => HotelLike, { nullable: true })
  hotelLikes?: HotelLike[];

  @Field(() => Photo, { nullable: true })
  photos?: Photo[];

  @Field()
  price!: number;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field(() => [Room], { nullable: true })
  rooms?: Room[];

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

  @Field({ nullable: true })
  weatherIconName?: string;

  @Field({ nullable: true })
  distanceKm?: string;

  @Field({ nullable: true })
  temperature?: string;

  @Field({ nullable: true })
  weatherDescription?: string;

  // @Column("geometry", {
  //   nullable: true,
  // })
  // @Index({
  //   spatial: true,
  // })
  geom?: { long: number; lat: number };

  @Field(() => PointObjectClassType, { nullable: true })
  // @Index({
  //   spatial: true,
  // })
  // @Column({
  //   type: "geography",
  //   nullable: true,
  //   spatialFeatureType: "Point",
  //   srid: 4326,
  // })
  coordinates?: PointObjectClassType;
}

@ObjectType()
export class HotelResolverReturnFake {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => HotelLike, { nullable: true })
  hotelLikes?: HotelLike[];

  @Field(() => Photo, { nullable: true })
  photos?: Photo[];

  @Field()
  price!: number;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field(() => [Room], { nullable: true })
  rooms?: Room[];

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

  @Field({ nullable: true })
  weatherIconName?: string;

  @Field({ nullable: true })
  distanceKm?: string;

  @Field({ nullable: true })
  temperature?: string;

  @Field({ nullable: true })
  weatherDescription?: string;

  @Field(() => PointObject, { nullable: true })
  coordinates?: PointObject;
}
