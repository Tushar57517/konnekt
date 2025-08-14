import { Queue } from "bullmq";
import redisConn from "../config/redis.js";

const userQueue = new Queue("new user", {
  connection: redisConn,
});

userQueue.on("waiting", (job) => {
  console.log(`New Job added: ${job.id}`);
});

export default userQueue;
