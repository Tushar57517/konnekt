import redisConn from "../config/redis.js";
import { Worker } from "bullmq";
import Profile from "../models/profile.model.js";

const userWorker = new Worker(
  "new user",
  async (job) => {
    if (job.name === "init new profile") {
      const data = job.data;

      const name = data.email.split("@")[0];

      await Profile.create({ user: data.userId, name });
    }
  },
  {
    connection: {
      ...redisConn,
      maxRetriesPerRequest: null,
    },
    autorun: false,
  }
);

userWorker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

export default userWorker;
