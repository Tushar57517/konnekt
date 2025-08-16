import express from "express";
import {
  allExperiences,
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from "../controllers/experience.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new", verifyToken, createExperience);
router.get("/profile/:profileId", verifyToken, allExperiences);
router.get("/id/:expId", verifyToken, getExperience);
router.patch("/update/:expId", verifyToken, updateExperience);
router.delete("/delete/:expId", verifyToken, deleteExperience);

export default router;
