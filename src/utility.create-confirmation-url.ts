import internalIp from "internal-ip";

import { confirmUserPrefix } from "./constants";
import { redis } from "./redis";

export const createConfirmationUrl = async (userId: string): Promise<string> => {
  const nodeEnv = process.env["NODE_ENV"] ? process.env["NODE_ENV"] : <const>"development";
  const port = process.env["ATAPI_VIRTUAL_PORT"] || <const>5000;
  const localIp = internalIp.v4.sync();

  const client = `http://${localIp}:${port}`;

  if (nodeEnv === "test") {
    await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration
    return `${client}/user/confirm/${userId}`;
  }

  if (nodeEnv === "development") {
    await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration
    return `${client}/user/confirm/${userId}`;
  }

  if (nodeEnv === "production") {
    const prodClientOrigin = process.env["PRODUCTION_CLIENT_ORIGIN"];
    await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration
    return `${prodClientOrigin}/user/confirm/${userId}`;
  } else {
    throw `The client domain is undefined. Please set the environment variable: PRODUCTION_CLIENT_ORIGIN`;
  }
};
