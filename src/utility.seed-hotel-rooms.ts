// utility.seed-hotel-from-element.overpass-json.ts

import { integer } from "casual";
import { Pool } from "pg";

import * as db from "./zapatos/src";
import { room } from "./zapatos/schema";
import { randomNumber } from "./utility.random-number";
import { getConnectionPool } from "./utility.get-connection-pool";

type Room = room.Insertable;

const pool: Pool = getConnectionPool(process.env.NODE_ENV);

const roomTypes = ["suite", "standard", "penthouse"];

export async function seedRooms(): Promise<void> {
  try {
    const hotels = await db.select("hotel", db.all).run(pool);

    hotels.forEach(async (singleHotel) => {
      for (let index = 0; index < randomNumber(10, 80); index++) {
        const roomObject: Room = {
          beds: integer(1, 2),
          costPerNight: integer(110, 450),
          maxOccupancy: integer(2, 4),
          roomNumber: "d",
          type: roomTypes[integer(1, 3) - 1],
          hotelId: singleHotel.id,
        };

        await db.insert("room", roomObject).run(pool);
      }
    });
  } catch (error) {
    console.error("ERROR GENERATING ROOMS\n", error);
  }
}
