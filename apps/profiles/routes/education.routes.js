import express from "express";
import {
  allEducation,
  createEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from "../controllers/education.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new", verifyToken, createEducation);
router.get("/profile/:profileId", verifyToken, allEducation);
router.get("/id/:eduId", verifyToken, getEducation);
router.patch("/update/:eduId", verifyToken, updateEducation);
router.delete("/delete/:eduId", verifyToken, deleteEducation);

export default router;
