import express from "express";
import { 
    createSpectralHealthData, 
    getSpectralHealthMap, 
    getSpectralHealthByZone, 
    getSpectralHealthSummary, 
    updateSpectralHealthData 
} from "../controllers/spectralHealth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Spectral Health routes
router.route("/create-data").post(createSpectralHealthData);
router.route("/field/:fieldId/map").get(getSpectralHealthMap);
router.route("/field/:fieldId/zone/:zoneId").get(getSpectralHealthByZone);
router.route("/field/:fieldId/summary").get(getSpectralHealthSummary);
router.route("/update-data/:id").put(updateSpectralHealthData);

export default router;
