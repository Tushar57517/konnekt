import express from "express";
import { allCertificates, getCertificate } from "../controllers/certificate.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:profileId", verifyToken, allCertificates);
router.get("/:certId", verifyToken, getCertificate);

export default router;
