import app from "./app.js";
import connectDB from "./config/db.js";
import userWorker from "./workers/userWorker.js";

const PORT = process.env.PORT || 3002;

connectDB();

userWorker.run();

app.listen(PORT, () => {
  console.log(`Profile service started on PORT: ${PORT}`);
});
