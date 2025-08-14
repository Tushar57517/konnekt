import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import certificateRoutes from "./routes/certificate.routes.js";
import educationRoutes from "./routes/education.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/certificates", certificateRoutes);
app.use("/api/education", educationRoutes);

export default app;
