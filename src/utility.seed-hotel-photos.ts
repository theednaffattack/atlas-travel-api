// utility.seed-hotel-from-element.overpass-json.ts

import bcrypt from "bcrypt";
import { email, first_name, last_name, words, sentences } from "casual";
import fetch from "node-fetch";

import prodPool from "./pg-pool";
import testPool from "./pg-pool-test";
import devPool from "./pg-pool-dev";
import * as db from "./zapatos/src";
import { photo } from "./zapatos/schema";

import { Pool } from "pg";
import { randomNumber } from "./utility.random-number";

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
}): Promise<Photo[]> {
  let allHotels;
  let pool: Pool;

  if (process.env.NODE_ENV === "test") {
    pool = testPool;
  }
  if (process.env.NODE_ENV === "production") {
    pool = prodPool;
  } else {
    pool = devPool;
  }

  try {
    allHotels = await db.select("hotel", db.all).run(pool);
  } catch (error) {
    throw Error(`Error ${error}`);
  }

  const cachedPhotos: any[] = [];

  try {
    for (const singleHotel of allHotels) {
      const numberOfPhotos = Math.floor(randomNumber(numMin, numMax));
      console.log("VIEEW NUMBER OF PHOTOS", numberOfPhotos);

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

          if (insertedPhotos) {
            cachedPhotos.push(insertedPhotos);
          }
          return insertedPhotos;
        }),
      );
    }
  } catch (error) {
    throw new Error(`Promise all error, ${error}`);
  }

  console.log("can we see cached photos?");

  try {
    db.insert("photo", cachedPhotos).run(pool);
  } catch (error) {
    console.log(`Error while saving photos!!!`);
  }

  return cachedPhotos;
}

// RAN PROGRAM AT 3:24 p.m., Wed, Sep 9, 2020
