// utility.seed-hotel-from-element.overpass-json.ts

import { first_name, integer } from "casual";

import prodPool from "./pg-pool";
import testPool from "./pg-pool-test";
import devPool from "./pg-pool-dev";
import * as db from "./zapatos/src";
import * as s from "./zapatos/schema";
import { hotel } from "./zapatos/schema";

import hotelData from "./utility.db-seed.overpass-hotels-sf.json";
import { Pool } from "pg";

type Hotel = hotel.Insertable;

interface ElementInterface {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    [key: string]: string;
  };
}

export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const sampleAmenities = ["wifi", "parking", "restaurant", "swimming", "bar"];

function buildFeatures(hotelElements: any[]): Hotel[] {
  const slicedAmenities = sampleAmenities.slice(0, randomNumber(1, 5)).join(",");
  let buildStreetAddress;

  const newFeatures = hotelElements.map(
    (element): Hotel => {
      if (element.tags?.["addr:housenumber"] && element.tags?.["addr:street"]) {
        buildStreetAddress = element.tags["addr:housenumber"] + " " + element.tags["addr:street"];
      } else {
        buildStreetAddress = "no address";
      }

      const geogPoint = (lon: number, lat: number) =>
        db.sql`ST_SetSRID(ST_MakePoint(${db.param(lon)}, ${db.param(lat)}), 4326)`;

      const prepareFeature: Hotel = {
        address: buildStreetAddress,
        amenities: slicedAmenities,
        city: element && element.tags && element.tags["addr:city"] ? element.tags["addr:city"] : "San Francisco",
        commentCount: -1,
        coordinates: geogPoint(element.lon, element.lat),
        loveCount: -1,
        name: element && element.tags && element.tags.name ? element.tags.name : "Hotel " + first_name,
        price: integer(150, 850),
        state: element && element.tags && element.tags["addr:state"] ? element.tags["addr:state"] : "CA",
        zipCode: element && element.tags && element.tags["addr:postcode"] ? element.tags["addr:postcode"] : "", // address.zipCode(),
      };
      return prepareFeature;
    },
  );
  return newFeatures;
}

export async function bulkInsertHotels(limit?: number): Promise<hotel.Selectable[]> {
  if (process.env.NODE_ENV === undefined) {
    throw new Error(
      "The NODE_ENV var is undefined. Please set it to 'development', 'production' or 'test' and try again.",
    );
  }

  let poolConnection: Pool;
  if (process.env.NODE_ENV === "test") {
    poolConnection = testPool;
  }
  if (process.env.NODE_ENV === "production") {
    poolConnection = prodPool;
  } else {
    poolConnection = devPool;
  }

  const hotelsLength = hotelData.elements.length - 1;
  const numberToSlice = limit ? limit : hotelsLength;
  const hotelSlice = hotelData.elements.slice(0, numberToSlice);

  const builtFeatures = buildFeatures(hotelSlice);
  if (poolConnection) {
    return await db.insert("hotel", builtFeatures).run(poolConnection);
  } else {
    throw new Error(
      "Error setting the database connection. Please check your env vars and try again. NODE_ENV must be 'test', 'development', or 'production'.",
    );
  }
}
