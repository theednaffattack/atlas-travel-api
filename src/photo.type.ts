import { Field, ID, ObjectType } from "type-graphql";
// import { PhotoMetadata } from "./PhotoMetadata";
import { Hotel } from "./hotel.type";
import { Venue } from "./venue.type";

// prettier-ignore
@ObjectType()
export class Photo  {
  @Field(() => ID)
  id!: string;

  @Field()
  uri!: string;

  @Field()
  name!: string;

  @Field({ nullable!: true })
  description!: string;

  @Field({ nullable!: true })
  isPublished!: boolean;

  
  @Field(()=> ID, { nullable!: false })
  hotelId!: string;

  
  @Field(()=> ID, { nullable!: false })
  hotel!: Hotel;

  @Field({ nullable!: true })
  venueId!: number;
  
  @Field(()=> Venue, { nullable!: true })
  venue!: Venue;
}

// export class PhotoType {
//   // @Field(() => ID)
//   // id!: string;

//   @Field()
//   uri!: string;

//   @CreateDateColumn()
//   createdAt!: Date;

//   @UpdateDateColumn()
//   updatedAt!: Date;

//   @Field()
//   name!: string;

//   @Field({ nullable!: true })
//   description!: string;

//   @Field({ nullable!: true })
//   isPublished!: boolean;

//   @Field(() => Hotel)
//   hotel!: Hotel;
// }
