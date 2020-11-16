// utility.migration.data.seed - hotels.ts;

import { bulkInsertHotels } from "./utility.seed-hotel-from-element.overpass-json";

bulkInsertHotels().then(processExit).catch(catchError);

function catchError(error: Error): void {
  console.warn("Error running bulk insert.\n", error);
}

function processExit() {
  process.exit();
}
