import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.NODE_ENV === "production" ? process.env.REDIS_HOST : "localhost",
  port: process.env.REDIS_PORT_NUMBER ? parseInt(process.env.REDIS_PORT_NUMBER) : 6379,
});
