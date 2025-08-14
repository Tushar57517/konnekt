import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/auth", userRoutes);

export default app;
