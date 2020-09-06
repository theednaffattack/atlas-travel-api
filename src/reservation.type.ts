import { Field, ID, ObjectType } from "type-graphql";
import { Room } from "./room.type";
import { User } from "./user.type";

// prettier-ignore
@ObjectType("Reservation", { description!: "The reservation model" })
export class Reservation {

  @Field(() => ID)
  id!: string;
  
  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;


  @Field(() => Date)
  from!: Date;


  @Field(() => Date)
  to!: Date;


  @Field(() => User)
  user!: User;


  @Field(() => Room)
  room!: Room;
}
