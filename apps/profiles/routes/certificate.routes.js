import express from "express";
import {
  allCertificates,
  createCertificate,
  deleteCertificate,
  getCertificate,
  updateCertificate,
} from "../controllers/certificate.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:profileId", verifyToken, allCertificates);
router.get("/id/:certId", verifyToken, getCertificate);
router.post("/new", verifyToken, createCertificate);
router.patch("/update/:certId", verifyToken, updateCertificate);
router.delete("/delete/:certId", verifyToken, deleteCertificate);

export default router;
