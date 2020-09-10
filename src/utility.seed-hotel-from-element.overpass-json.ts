// utility.seed-hotel-from-element.overpass-json.ts

import { first_name, integer } from "casual";

import * as db from "./zapatos/src";
import { hotel } from "./zapatos/schema";

import hotelData from "./utility.db-seed.overpass-hotels-sf.json";
import { randomNumber } from "./utility.random-number";
import { getConnectionPool } from "./utility.get-connection-pool";

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

export async function bulkInsertHotels(limit?: number): Promise<hotel.Selectable[] | undefined> {
  const poolConnection = getConnectionPool(process.env.NODE_ENV);

  const hotelsLength = hotelData.elements.length - 1;
  const numberToSlice = limit ? limit : hotelsLength;
  const hotelSlice = hotelData.elements.slice(0, numberToSlice);

  const builtFeatures = buildFeatures(hotelSlice);

  let insertedHotel;

  try {
    insertedHotel = await db.insert("hotel", builtFeatures).run(poolConnection);
  } catch (error) {
    console.log("Error setting the database connection.\n", error);
  }
  return insertedHotel;
}
