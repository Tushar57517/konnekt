import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisconfig = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
};

const redisConn = new Redis(redisconfig);

redisConn.on("connect", () => {
  console.log(`Connected to Redis...`);
});

export default redisConn;
