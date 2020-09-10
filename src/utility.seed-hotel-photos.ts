// utility.seed-hotel-from-element.overpass-json.ts

import { words, sentences } from "casual";
import fetch from "node-fetch";

import * as db from "./zapatos/src";
import { photo } from "./zapatos/schema";

import { Pool } from "pg";
import { randomNumber } from "./utility.random-number";
import { getConnectionPool } from "./utility.get-connection-pool";

type Photo = photo.Selectable;

const unsplashHotelsCollectionId = 3466704;

async function getImagesFromApiAsync() {
  try {
    const responseThing = await fetch(`https://source.unsplash.com/collection/${unsplashHotelsCollectionId}/400x500`, {
      method: "GET",
    });

    return responseThing;
  } catch (error) {
    console.error(error);
  }
  return "no-url";
}

export async function generateHotelPhotos({
  numMax = 9,
  numMin = 3,
}: {
  numMax: number;
  numMin: number;
}): Promise<void> {
  let allHotels;
  const pool: Pool = getConnectionPool(process.env.NODE_ENV);

  try {
    allHotels = await db.select("hotel", db.all).run(pool);
  } catch (error) {
    throw Error(`Error selecting hotels.\n${error}`);
  }

  try {
    for (const singleHotel of allHotels) {
      const numberOfPhotos = Math.floor(randomNumber(numMin, numMax));

      // NOTE: why can't this be one insert into Photos after
      // prepping the images?
      await Promise.all(
        Array.from(Array(numberOfPhotos).keys()).map(async () => {
          const insertedPhotos = await db
            .insert("photo", [
              {
                description: sentences(2),
                hotelId: singleHotel.id,
                isPublished: true,
                name: words(randomNumber(1, 2)),
                uri: await getImagesFromApiAsync().then((data) => {
                  return data !== "no-url" ? data.url : data;
                }),
              },
            ])
            .run(pool)
            .then((data) => data)
            .catch((err) => {
              console.error(err);
            });

          return insertedPhotos;
        }),
      );
    }
  } catch (error) {
    throw new Error(`Error inserting hotel photos.\n ${error}`);
  }
}

// RAN PROGRAM AT 3:24 p.m., Wed, Sep 9, 2020
