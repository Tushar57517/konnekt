import express from "express";
import dotenv from "dotenv";
import certificateRoutes from "./routes/certificate.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/certificates", certificateRoutes);

export default app;
